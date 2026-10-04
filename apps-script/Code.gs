/**
 * Entreobra — Recibe los dos formularios del sitio:
 *  - Registro de productos (registro/index.html) → pestaña "Hoja 1".
 *  - Acceso anticipado de la landing (tipo: "acceso") → pestaña "Acceso anticipado".
 *
 * Registro de productos
 * Recibe los envíos de registro/index.html y los escribe en la pestaña "Hoja 1"
 * (la del formulario del cliente), debajo de sus encabezados y en el mismo orden.
 * Agrega una columna "ID envío" al final para no duplicar una lista reenviada.
 *
 * Si cambias los campos en el CONFIG del HTML, cambia también CAMPOS_FERRETERIA
 * y CAMPOS_PRODUCTO aquí abajo (mismas `key`, mismo orden). Después:
 * Implementar → Administrar implementaciones → Editar → Nueva versión.
 */

// ---------------------------------------------------------------------------
// Configuración (debe coincidir con el CONFIG de registro/index.html)
// ---------------------------------------------------------------------------
var NOMBRE_HOJA = "Hoja 1";       // pestaña del cliente; si no existe, se usa/crea "Productos"
var HOJA_RESPALDO = "Productos";
var ZONA_HORARIA = "America/La_Paz";
var MAX_PRODUCTOS = 500;
var HOJA_ACCESO = "Acceso anticipado";
var ENCABEZADOS_ACCESO = ["Fecha", "Nombre", "Participa como", "WhatsApp", "ID envío"];
var TIPOS_ACCESO = { obra: "Estoy en obra", proveedor: "Vendo materiales" };

var CAMPOS_FERRETERIA = [
  { key: "negocio",  columna: "Ferreteria", requerido: true,  max: 120 },
  { key: "contacto", columna: "Contacto",   requerido: true,  max: 80 },
  { key: "whatsapp", columna: "WhatsApp",   requerido: true,  max: 30 },
  { key: "zona",     columna: "Zona",       requerido: true,  max: 80 },
  { key: "correo",   columna: "Correo",     requerido: false, max: 120 },
];

// Mismo orden que las columnas de la hoja del cliente.
var CAMPOS_PRODUCTO = [
  { key: "categoria", columna: "Categoria",              tipo: "texto",  requerido: true,  max: 60 },
  { key: "material",  columna: "Material",               tipo: "texto",  requerido: true,  max: 120 },
  { key: "medida",    columna: "Medida/variante",        tipo: "texto",  requerido: false, max: 60 },
  { key: "marca",     columna: "Marca",                  tipo: "texto",  requerido: false, max: 60 },
  { key: "unidad",    columna: "Unidad",                 tipo: "texto",  requerido: true,  max: 30 },
  { key: "precio",    columna: "Precio (Bs)",            tipo: "numero", requerido: true,  min: 0.01, decimales: 2 },
  { key: "stock",     columna: "Stock (Si/No)",          tipo: "sino",   requerido: false },
  { key: "entrega",   columna: "Entrega a obra (Si/No)", tipo: "sino",   requerido: false },
];

// ---------------------------------------------------------------------------
// Entradas de la aplicación web
// ---------------------------------------------------------------------------

/** Para probar la URL en el navegador: debe mostrar ok: true. */
function doGet() {
  return responder({ ok: true, servicio: "entreobra-registro" });
}

/** Recibe un envío (JSON en texto plano) y escribe una fila por producto. */
function doPost(e) {
  var candado = LockService.getScriptLock();
  try {
    candado.waitLock(20000); // evita que dos envíos simultáneos se pisen
  } catch (err) {
    return responder({ ok: false, error: "Servidor ocupado. Intenta de nuevo en unos segundos." });
  }

  try {
    var datos;
    try {
      datos = JSON.parse(e && e.postData && e.postData.contents);
    } catch (err) {
      return responder({ ok: false, error: "No pudimos leer el envío." });
    }

    // Trampa para bots: si viene lleno, se responde ok sin escribir nada.
    if (datos && datos.honeypot) {
      return responder({ ok: true, id: String(datos.id || ""), filas: 0 });
    }

    // Formulario de acceso anticipado de la landing.
    if (datos && datos.tipo === "acceso") return guardarAcceso(datos);

    var error = validar(datos);
    if (error) return responder({ ok: false, error: error });

    var hoja = obtenerHoja();
    var id = String(datos.id);

    // Idempotencia: si este ID ya está en la hoja, no se duplica.
    if (idYaExiste(hoja, id)) {
      return responder({ ok: true, id: id, filas: datos.productos.length, duplicado: true });
    }

    var fecha = Utilities.formatDate(new Date(), ZONA_HORARIA, "yyyy-MM-dd HH:mm:ss");
    var f = datos.ferreteria;
    var filas = datos.productos.map(function (p) {
      var fila = [fecha];
      CAMPOS_FERRETERIA.forEach(function (c) { fila.push(sanear(f[c.key])); });
      CAMPOS_PRODUCTO.forEach(function (c) {
        var v = p[c.key];
        if (c.tipo === "numero") fila.push(v === null || v === undefined || v === "" ? "" : Number(v));
        else fila.push(sanear(v));
      });
      fila.push(id);
      return fila;
    });

    // Todas las filas de una vez (más rápido y atómico que appendRow en bucle).
    var desde = hoja.getLastRow() + 1;
    hoja.getRange(desde, 1, filas.length, filas[0].length).setValues(filas);

    return responder({ ok: true, id: id, filas: filas.length });
  } catch (err) {
    return responder({ ok: false, error: "Error al guardar: " + (err && err.message ? err.message : err) });
  } finally {
    candado.releaseLock();
  }
}

// ---------------------------------------------------------------------------
// Acceso anticipado (formulario de la landing)
// ---------------------------------------------------------------------------
function guardarAcceso(datos) {
  var nombre = texto(datos.nombre);
  var whatsapp = texto(datos.whatsapp);
  var tipo = TIPOS_ACCESO[datos.tipoUsuario];
  var id = texto(datos.id);
  if (!nombre || !whatsapp || !tipo) return responder({ ok: false, error: "Completa tu nombre, WhatsApp y cómo participas." });
  if (nombre.length > 120 || whatsapp.length > 30 || !id || id.length > 64) return responder({ ok: false, error: "Datos inválidos." });

  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(HOJA_ACCESO) || libro.insertSheet(HOJA_ACCESO);
  if (hoja.getLastRow() === 0) {
    hoja.getRange(1, 1, 1, ENCABEZADOS_ACCESO.length).setValues([ENCABEZADOS_ACCESO]).setFontWeight("bold");
    hoja.setFrozenRows(1);
  }
  var ultima = hoja.getLastRow();
  if (ultima >= 2) {
    var ids = hoja.getRange(2, ENCABEZADOS_ACCESO.length, ultima - 1, 1).getValues();
    for (var i = 0; i < ids.length; i++) {
      if (String(ids[i][0]) === id) return responder({ ok: true, id: id, duplicado: true });
    }
  }
  var fecha = Utilities.formatDate(new Date(), ZONA_HORARIA, "yyyy-MM-dd HH:mm:ss");
  hoja.getRange(ultima + 1, 1, 1, ENCABEZADOS_ACCESO.length).setValues([[fecha, sanear(nombre), tipo, sanear(whatsapp), id]]);
  return responder({ ok: true, id: id, filas: 1 });
}

// ---------------------------------------------------------------------------
// Validación del lado del servidor (no se confía en la página)
// ---------------------------------------------------------------------------
function validar(datos) {
  if (!datos || typeof datos !== "object") return "Envío vacío.";
  if (!datos.id || String(datos.id).length > 64) return "Falta el código de envío.";
  if (!datos.ferreteria || typeof datos.ferreteria !== "object") return "Faltan los datos de la ferretería.";
  if (!Array.isArray(datos.productos) || datos.productos.length === 0) return "La lista no tiene productos.";
  if (datos.productos.length > MAX_PRODUCTOS) return "Máximo " + MAX_PRODUCTOS + " productos por envío.";

  for (var i = 0; i < CAMPOS_FERRETERIA.length; i++) {
    var c = CAMPOS_FERRETERIA[i];
    var v = texto(datos.ferreteria[c.key]);
    if (c.requerido && !v) return "Falta " + c.columna + ".";
    if (v.length > c.max) return c.columna + " es demasiado largo.";
  }

  for (var n = 0; n < datos.productos.length; n++) {
    var p = datos.productos[n];
    if (!p || typeof p !== "object") return "Producto " + (n + 1) + " inválido.";
    for (var k = 0; k < CAMPOS_PRODUCTO.length; k++) {
      var campo = CAMPOS_PRODUCTO[k];
      var valor = p[campo.key];
      var donde = "Producto " + (n + 1) + ", " + campo.columna;
      if (campo.tipo === "numero") {
        var vacio = valor === null || valor === undefined || valor === "";
        if (vacio) { if (campo.requerido) return donde + ": falta."; continue; }
        if (typeof valor !== "number" || !isFinite(valor)) return donde + ": no es un número.";
        if (campo.min !== undefined && valor < campo.min) return donde + ": debe ser " + campo.min + " o más.";
        if (campo.decimales === 0 && Math.floor(valor) !== valor) return donde + ": va sin decimales.";
      } else if (campo.tipo === "sino") {
        var r = texto(valor);
        if (campo.requerido && !r) return donde + ": falta.";
        if (r && ["Sí", "Si", "No"].indexOf(r) < 0) return donde + ": tiene que ser Sí o No.";
      } else {
        var t = texto(valor);
        if (campo.requerido && !t) return donde + ": falta.";
        if (campo.max && t.length > campo.max) return donde + ": demasiado largo.";
      }
    }
  }
  return "";
}

// ---------------------------------------------------------------------------
// Hoja
// ---------------------------------------------------------------------------
function encabezados() {
  var cols = ["Fecha"];
  CAMPOS_FERRETERIA.forEach(function (c) { cols.push(c.columna); });
  CAMPOS_PRODUCTO.forEach(function (c) { cols.push(c.columna); });
  cols.push("ID envío");
  return cols;
}

/**
 * Devuelve la pestaña donde se escribe: "Hoja 1" (la del cliente) o, si no
 * existe, "Productos" (se crea). Si está vacía escribe los encabezados; si ya
 * tiene los del cliente, solo agrega "ID envío" al final cuando falta.
 */
function obtenerHoja() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(NOMBRE_HOJA) || libro.getSheetByName(HOJA_RESPALDO) || libro.insertSheet(HOJA_RESPALDO);
  var cols = encabezados();
  if (hoja.getLastRow() === 0) {
    hoja.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight("bold");
    hoja.setFrozenRows(1);
  } else {
    var celdaId = hoja.getRange(1, cols.length);
    if (String(celdaId.getValue()).trim() === "") celdaId.setValue("ID envío").setFontWeight("bold");
  }
  return hoja;
}

function idYaExiste(hoja, id) {
  var ultima = hoja.getLastRow();
  if (ultima < 2) return false;
  var columnaId = encabezados().length; // "ID envío" es la última columna
  var ids = hoja.getRange(2, columnaId, ultima - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === id) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
function texto(v) {
  return v === null || v === undefined ? "" : String(v).trim();
}

/** Evita que la hoja interprete una celda como fórmula (=, +, -, @). */
function sanear(v) {
  var s = texto(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function responder(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON);
}
