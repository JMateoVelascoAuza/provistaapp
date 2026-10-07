/**
 * Entreobra — Recibe los dos formularios del sitio (solo si traen
 * consentimiento: true) y avisa por correo a la cuenta dueña del script:
 *  - Registro de productos (registro/index.html) → pestaña "Hoja 1".
 *  - Acceso anticipado de la landing (tipo: "acceso") → pestaña "Acceso anticipado".
 *
 * Cada dato se escribe en la columna que lleva su nombre (no por posición):
 * si alguien mueve o agrega columnas en la hoja, nada se corre. Si falta una
 * columna, se agrega al final. Además se guardan "ID envío" (para no duplicar
 * una lista reenviada) y "Acepta privacidad" (prueba del consentimiento).
 *
 * Instalación (una vez, desde el editor de Apps Script):
 *  1. Ejecutar `configurar`: pide los permisos, da formato a la hoja, crea el
 *     borrado automático de datos viejos y manda un correo de prueba.
 *  2. Implementar → Nueva implementación → Aplicación web, "Ejecutar como: Yo",
 *     "Quién tiene acceso: Cualquier persona".
 *
 * Si cambias los campos en el CONFIG del HTML, cambia también CAMPOS_FERRETERIA,
 * CAMPOS_PRODUCTO, CATEGORIAS y UNIDADES aquí abajo (mismas `key` y valores).
 * Después: Implementar → Administrar implementaciones → Editar → Nueva versión
 * (así la URL no cambia).
 */

// ---------------------------------------------------------------------------
// Configuración (debe coincidir con el CONFIG de registro/index.html)
// ---------------------------------------------------------------------------
var NOMBRE_HOJA = "Hoja 1";       // pestaña del cliente; si no existe, se usa/crea "Productos"
var HOJA_RESPALDO = "Productos";
var ZONA_HORARIA = "America/La_Paz";
var MAX_PRODUCTOS = 500;
var MAX_CARACTERES_ENVIO = 400000; // ~500 productos con holgura; más grande se rechaza
var HOJA_ACCESO = "Acceso anticipado";
var TIPOS_ACCESO = { obra: "Estoy en obra", proveedor: "Vendo materiales" };
var COLUMNA_FECHA = "Fecha";
var COLUMNA_ID = "ID envío";
var COLUMNA_PRIVACIDAD = "Acepta privacidad";
var ENCABEZADOS_ACCESO = [COLUMNA_FECHA, "Nombre", "Participa como", "WhatsApp", COLUMNA_PRIVACIDAD, COLUMNA_ID];

// Aviso por correo de cada registro nuevo (acceso anticipado y listas de
// productos). CORREO_AVISO vacío = la cuenta de Google dueña de este script.
var AVISAR_POR_CORREO = true;
var CORREO_AVISO = "";

// Política de privacidad: los datos se conservan 24 meses. `borrarAntiguos`
// corre cada día (lo programa `configurar`) y borra las filas más viejas.
var MESES_RETENCION = 24;

// Contra spam: la URL es pública. Máximo de envíos aceptados por hora.
var ENVIOS_POR_HORA_POR_NUMERO = 10;
var ENVIOS_POR_HORA_TOTAL = 300;

// Listas cerradas (las mismas del registro).
var CATEGORIAS = ["Cemento", "Fierro y acero", "Áridos", "Ladrillos y bloques", "Cerámicos", "Tuberías y sanitarios", "Otros"];
var UNIDADES = ["bolsa", "varilla", "pieza", "m³", "m²", "metro", "rollo", "kg", "litro", "otra"];

var CAMPOS_FERRETERIA = [
  { key: "negocio",  columna: "Ferreteria", tipo: "texto",    requerido: true,  max: 120 },
  { key: "contacto", columna: "Contacto",   tipo: "texto",    requerido: true,  max: 80 },
  { key: "whatsapp", columna: "WhatsApp",   tipo: "telefono", requerido: true,  max: 30 },
  { key: "zona",     columna: "Zona",       tipo: "texto",    requerido: true,  max: 80 },
  { key: "correo",   columna: "Correo",     tipo: "correo",   requerido: false, max: 120 },
];

var CAMPOS_PRODUCTO = [
  { key: "categoria", columna: "Categoria",              tipo: "lista",  requerido: true,  opciones: CATEGORIAS },
  { key: "material",  columna: "Material",               tipo: "texto",  requerido: true,  max: 120 },
  { key: "medida",    columna: "Medida/variante",        tipo: "texto",  requerido: false, max: 60 },
  { key: "marca",     columna: "Marca",                  tipo: "texto",  requerido: false, max: 60 },
  { key: "unidad",    columna: "Unidad",                 tipo: "lista",  requerido: true,  opciones: UNIDADES },
  { key: "precio",    columna: "Precio (Bs)",            tipo: "numero", requerido: true,  min: 0.01, max: 10000000, decimales: 2 },
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
  var contenido = e && e.postData && e.postData.contents;
  if (contenido && contenido.length > MAX_CARACTERES_ENVIO) {
    return responder({ ok: false, error: "El envío es demasiado grande. Divide la lista en partes." });
  }

  var candado = LockService.getScriptLock();
  try {
    candado.waitLock(20000); // evita que dos envíos simultáneos se pisen
  } catch (err) {
    return responder({ ok: false, error: "Servidor ocupado. Intenta de nuevo en unos segundos." });
  }

  try {
    var datos;
    try {
      datos = JSON.parse(contenido);
    } catch (err) {
      return responder({ ok: false, error: "No pudimos leer el envío." });
    }

    // Trampa para bots: si viene lleno, se responde ok sin escribir nada.
    if (datos && datos.honeypot) {
      return responder({ ok: true, id: String(datos.id || ""), filas: 0 });
    }

    // Sin consentimiento expreso no se guarda nada (DS 1793, art. 56).
    if (!datos || datos.consentimiento !== true) {
      return responder({ ok: false, error: "Para enviar tus datos tienes que aceptar la Política de privacidad." });
    }

    // Formulario de acceso anticipado de la landing.
    if (datos.tipo === "acceso") return guardarAcceso(datos);

    var limpio = validar(datos);
    if (limpio.error) return responder({ ok: false, error: limpio.error });

    var hoja = obtenerHoja();
    var columnas = prepararHoja(hoja, encabezados());
    var id = String(datos.id);

    // Idempotencia: si este ID ya está en la hoja, no se duplica.
    if (idYaExiste(hoja, columnas, id)) {
      return responder({ ok: true, id: id, filas: limpio.productos.length, duplicado: true });
    }

    var f = limpio.ferreteria;
    var limite = revisarLimite(f.whatsapp);
    if (limite) return responder({ ok: false, error: limite });

    var fecha = Utilities.formatDate(new Date(), ZONA_HORARIA, "yyyy-MM-dd HH:mm:ss");
    var privacidad = textoPrivacidad(datos.versionPoliticas);
    var filas = limpio.productos.map(function (p) {
      var valores = {};
      valores[COLUMNA_FECHA] = fecha;
      CAMPOS_FERRETERIA.forEach(function (c) { valores[c.columna] = sanear(f[c.key]); });
      CAMPOS_PRODUCTO.forEach(function (c) { valores[c.columna] = c.tipo === "numero" ? p[c.key] : sanear(p[c.key]); });
      valores[COLUMNA_ID] = id;
      valores[COLUMNA_PRIVACIDAD] = privacidad;
      return filaSegun(columnas, valores);
    });

    // Todas las filas de una vez (más rápido y atómico que appendRow en bucle).
    hoja.getRange(hoja.getLastRow() + 1, 1, filas.length, columnas.length).setValues(filas);
    contarEnvio(f.whatsapp);

    avisar(
      "Entreobra: " + f.negocio + " envió " + filas.length + (filas.length === 1 ? " producto" : " productos"),
      [
        "Llegó una lista de productos nueva a la hoja.",
        "",
        "Ferretería: " + f.negocio,
        "Contacto: " + f.contacto,
        "WhatsApp: " + f.whatsapp,
        "Zona: " + f.zona,
        "Productos: " + filas.length,
        "Fecha: " + fecha,
      ]
    );

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
  var whatsappCrudo = texto(datos.whatsapp);
  var tipo = TIPOS_ACCESO[datos.tipoUsuario];
  var id = texto(datos.id);
  if (!nombre || !whatsappCrudo || !tipo) return responder({ ok: false, error: "Completa tu nombre, WhatsApp y cómo participas." });
  if (nombre.length > 120 || whatsappCrudo.length > 30 || !id || id.length > 64) return responder({ ok: false, error: "Datos inválidos." });
  // La landing no valida el formato: si se reconoce, se guarda ordenado.
  var whatsapp = normalizarTelefono(whatsappCrudo) || whatsappCrudo;

  var hoja = obtenerHojaAcceso();
  var columnas = prepararHoja(hoja, ENCABEZADOS_ACCESO);
  if (idYaExiste(hoja, columnas, id)) return responder({ ok: true, id: id, duplicado: true });

  var limite = revisarLimite(whatsapp);
  if (limite) return responder({ ok: false, error: limite });

  var valores = {};
  valores[COLUMNA_FECHA] = Utilities.formatDate(new Date(), ZONA_HORARIA, "yyyy-MM-dd HH:mm:ss");
  valores["Nombre"] = sanear(nombre);
  valores["Participa como"] = tipo;
  valores["WhatsApp"] = sanear(whatsapp);
  valores[COLUMNA_PRIVACIDAD] = textoPrivacidad(datos.versionPoliticas);
  valores[COLUMNA_ID] = id;
  hoja.getRange(hoja.getLastRow() + 1, 1, 1, columnas.length).setValues([filaSegun(columnas, valores)]);
  contarEnvio(whatsapp);

  avisar("Entreobra: nuevo acceso anticipado — " + nombre, [
    "Alguien se anotó al acceso anticipado desde el sitio.",
    "",
    "Nombre: " + nombre,
    "Participa como: " + tipo,
    "WhatsApp: " + whatsapp,
    "Fecha: " + valores[COLUMNA_FECHA],
  ]);

  return responder({ ok: true, id: id, filas: 1 });
}

// ---------------------------------------------------------------------------
// Validación del lado del servidor (no se confía en la página)
// ---------------------------------------------------------------------------

/**
 * Revisa el envío de productos y devuelve los datos ya normalizados
 * ({ ferreteria, productos }) o { error } con el primer problema.
 */
function validar(datos) {
  if (!datos || typeof datos !== "object") return { error: "Envío vacío." };
  if (!datos.id || String(datos.id).length > 64) return { error: "Falta el código de envío." };
  if (!datos.ferreteria || typeof datos.ferreteria !== "object") return { error: "Faltan los datos de la ferretería." };
  if (!Array.isArray(datos.productos) || datos.productos.length === 0) return { error: "La lista no tiene productos." };
  if (datos.productos.length > MAX_PRODUCTOS) return { error: "Máximo " + MAX_PRODUCTOS + " productos por envío." };

  var ferreteria = {};
  for (var i = 0; i < CAMPOS_FERRETERIA.length; i++) {
    var c = CAMPOS_FERRETERIA[i];
    var v = texto(datos.ferreteria[c.key]);
    if (!v) {
      if (c.requerido) return { error: "Falta " + c.columna + "." };
    } else if (v.length > c.max) {
      return { error: c.columna + " es demasiado largo." };
    } else if (c.tipo === "telefono") {
      v = normalizarTelefono(v);
      if (!v) return { error: "Revisa el WhatsApp: 8 dígitos que empiecen con 6 o 7, o un número internacional con +." };
    } else if (c.tipo === "correo" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      return { error: "Revisa el correo de la ferretería." };
    }
    ferreteria[c.key] = v;
  }

  var productos = [];
  for (var n = 0; n < datos.productos.length; n++) {
    var p = datos.productos[n];
    if (!p || typeof p !== "object") return { error: "Producto " + (n + 1) + " inválido." };
    var limpio = {};
    for (var k = 0; k < CAMPOS_PRODUCTO.length; k++) {
      var campo = CAMPOS_PRODUCTO[k];
      var valor = p[campo.key];
      var donde = "Producto " + (n + 1) + ", " + campo.columna;
      if (campo.tipo === "numero") {
        var vacio = valor === null || valor === undefined || valor === "";
        if (vacio) {
          if (campo.requerido) return { error: donde + ": falta." };
          limpio[campo.key] = "";
          continue;
        }
        if (typeof valor !== "number" || !isFinite(valor)) return { error: donde + ": no es un número." };
        if (campo.min !== undefined && valor < campo.min) return { error: donde + ": debe ser " + campo.min + " o más." };
        if (campo.max !== undefined && valor > campo.max) return { error: donde + ": es demasiado grande." };
        var factor = Math.pow(10, campo.decimales || 0);
        limpio[campo.key] = Math.round(valor * factor) / factor;
        continue;
      }
      var t = texto(valor);
      if (!t) {
        if (campo.requerido) return { error: donde + ": falta." };
        limpio[campo.key] = "";
        continue;
      }
      if (campo.tipo === "sino") {
        t = normalizarSiNo(t);
        if (!t) return { error: donde + ": tiene que ser Sí o No." };
      } else if (campo.tipo === "lista") {
        t = buscarEnLista(campo.opciones, t);
        if (!t) return { error: donde + ": no es una opción válida." };
      } else if (campo.max && t.length > campo.max) {
        return { error: donde + ": demasiado largo." };
      }
      limpio[campo.key] = t;
    }
    productos.push(limpio);
  }
  return { ferreteria: ferreteria, productos: productos };
}

/** "76971774", "+591 7697-1774" → "+591 76971774". Internacional con + se deja. */
function normalizarTelefono(v) {
  var limpio = texto(v).replace(/[\s\-().]/g, "");
  if (/^(\+?591)?[67]\d{7}$/.test(limpio)) return "+591 " + limpio.slice(-8);
  if (/^\+\d{8,15}$/.test(limpio)) return limpio;
  return "";
}

/** "si", "Si", "SÍ" → "Sí"; "no" → "No"; otra cosa → "". */
function normalizarSiNo(v) {
  var t = sinTildes(v);
  if (t === "si") return "Sí";
  if (t === "no") return "No";
  return "";
}

/** Devuelve la opción de la lista tal como está escrita ahí, sin importar mayúsculas ni tildes. */
function buscarEnLista(lista, v) {
  var buscado = sinTildes(v);
  for (var i = 0; i < lista.length; i++) {
    if (sinTildes(lista[i]) === buscado) return lista[i];
  }
  return "";
}

function sinTildes(v) {
  return texto(v).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ");
}

// ---------------------------------------------------------------------------
// Límite de envíos (contra spam)
// ---------------------------------------------------------------------------

/** Devuelve un mensaje de error si se pasó del límite por hora, o "". */
function revisarLimite(whatsapp) {
  try {
    var cache = CacheService.getScriptCache();
    if (Number(cache.get(claveNumero(whatsapp)) || 0) >= ENVIOS_POR_HORA_POR_NUMERO) {
      return "Recibimos muchos envíos de este número. Intenta de nuevo en una hora o escríbenos por WhatsApp.";
    }
    if (Number(cache.get("envios:total") || 0) >= ENVIOS_POR_HORA_TOTAL) {
      return "Estamos recibiendo muchos envíos. Intenta de nuevo en una hora o escríbenos por WhatsApp.";
    }
  } catch (err) {
    console.warn("No se pudo revisar el límite de envíos: " + (err && err.message ? err.message : err));
  }
  return "";
}

function contarEnvio(whatsapp) {
  try {
    var cache = CacheService.getScriptCache();
    [claveNumero(whatsapp), "envios:total"].forEach(function (clave) {
      cache.put(clave, String(Number(cache.get(clave) || 0) + 1), 3600);
    });
  } catch (err) {
    console.warn("No se pudo contar el envío: " + (err && err.message ? err.message : err));
  }
}

function claveNumero(whatsapp) {
  return "envios:" + texto(whatsapp).replace(/\D/g, "");
}

// ---------------------------------------------------------------------------
// Hoja
// ---------------------------------------------------------------------------
function encabezados() {
  var cols = [COLUMNA_FECHA];
  CAMPOS_FERRETERIA.forEach(function (c) { cols.push(c.columna); });
  CAMPOS_PRODUCTO.forEach(function (c) { cols.push(c.columna); });
  cols.push(COLUMNA_ID, COLUMNA_PRIVACIDAD);
  return cols;
}

/** "Hoja 1" (la del cliente) o, si no existe, "Productos" (se crea). */
function obtenerHoja() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  return libro.getSheetByName(NOMBRE_HOJA) || libro.getSheetByName(HOJA_RESPALDO) || libro.insertSheet(HOJA_RESPALDO);
}

function obtenerHojaAcceso() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  return libro.getSheetByName(HOJA_ACCESO) || libro.insertSheet(HOJA_ACCESO);
}

/**
 * Deja en la fila 1 todos los encabezados esperados y devuelve los nombres de
 * las columnas en su orden actual. Si la hoja está vacía los escribe; si ya
 * tiene encabezados, solo agrega al final los que faltan (no mueve nada).
 */
function prepararHoja(hoja, esperados) {
  if (hoja.getLastRow() === 0) {
    hoja.getRange(1, 1, 1, esperados.length).setValues([esperados]).setFontWeight("bold");
    hoja.setFrozenRows(1);
    return esperados.slice();
  }
  var ancho = Math.max(hoja.getLastColumn(), 1);
  var columnas = hoja.getRange(1, 1, 1, ancho).getValues()[0].map(function (c) { return String(c).trim(); });
  // Celdas vacías al final de la fila 1 no cuentan como columnas.
  while (columnas.length && !columnas[columnas.length - 1]) columnas.pop();
  esperados.forEach(function (nombre) {
    if (columnas.indexOf(nombre) < 0) {
      columnas.push(nombre);
      hoja.getRange(1, columnas.length).setValue(nombre).setFontWeight("bold");
    }
  });
  return columnas;
}

/** Arma una fila en el orden de `columnas` con los valores por nombre de columna. */
function filaSegun(columnas, valores) {
  return columnas.map(function (c) { return valores.hasOwnProperty(c) ? valores[c] : ""; });
}

function idYaExiste(hoja, columnas, id) {
  var ultima = hoja.getLastRow();
  if (ultima < 2) return false;
  var ids = hoja.getRange(2, columnas.indexOf(COLUMNA_ID) + 1, ultima - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === id) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Instalación y mantenimiento (se ejecutan desde el editor o por activador)
// ---------------------------------------------------------------------------

/**
 * Ejecutar UNA vez desde el editor (botón Ejecutar) con la cuenta dueña de la
 * hoja. Pide los permisos, ordena y da formato a las dos pestañas, programa el
 * borrado diario de datos viejos y manda un correo de prueba. Se puede volver
 * a ejecutar sin problema: no duplica nada.
 */
function configurar() {
  var productos = obtenerHoja();
  var columnasProductos = prepararHoja(productos, encabezados());
  darFormato(productos, columnasProductos);
  var acceso = obtenerHojaAcceso();
  var columnasAcceso = prepararHoja(acceso, ENCABEZADOS_ACCESO);
  darFormato(acceso, columnasAcceso);

  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "borrarAntiguos") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("borrarAntiguos").timeBased().everyDays(1).atHour(3).inTimezone(ZONA_HORARIA).create();

  probarAviso();
  console.log("Listo: hoja con formato, borrado diario programado y correo de prueba enviado.");
}

/** Encabezados en negrita, fijos y protegidos; fechas, precios y Sí/No con formato. */
function darFormato(hoja, columnas) {
  var filas = Math.max(hoja.getMaxRows() - 1, 1);
  hoja.getRange(1, 1, 1, columnas.length).setFontWeight("bold");
  hoja.setFrozenRows(1);

  var col = function (nombre) { return columnas.indexOf(nombre) + 1; };
  if (col(COLUMNA_FECHA)) hoja.getRange(2, col(COLUMNA_FECHA), filas, 1).setNumberFormat("yyyy-mm-dd hh:mm:ss");
  if (col("Precio (Bs)")) hoja.getRange(2, col("Precio (Bs)"), filas, 1).setNumberFormat("#,##0.00");
  var siNo = SpreadsheetApp.newDataValidation().requireValueInList(["Sí", "No"], true).setAllowInvalid(false).build();
  ["Stock (Si/No)", "Entrega a obra (Si/No)"].forEach(function (nombre) {
    if (col(nombre)) hoja.getRange(2, col(nombre), filas, 1).setDataValidation(siNo);
  });

  // Protección "solo advertencia": quien edite un encabezado ve un aviso,
  // porque cambiarlo haría que el script cree otra columna.
  var descripcion = "Encabezados de Entreobra (los usa el script)";
  hoja.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (p) {
    if (p.getDescription() === descripcion) p.remove();
  });
  hoja.getRange(1, 1, 1, columnas.length).protect().setDescription(descripcion).setWarningOnly(true);
}

/**
 * Borra las filas con más de MESES_RETENCION meses (lo promete la Política de
 * privacidad). La programa `configurar` para que corra cada día.
 */
function borrarAntiguos() {
  var limite = new Date();
  limite.setMonth(limite.getMonth() - MESES_RETENCION);
  var borradas = 0;
  [obtenerHoja(), obtenerHojaAcceso()].forEach(function (hoja) {
    var ultima = hoja.getLastRow();
    if (ultima < 2) return;
    var columnas = prepararHoja(hoja, []);
    var colFecha = columnas.indexOf(COLUMNA_FECHA) + 1;
    if (!colFecha) return;
    var fechas = hoja.getRange(2, colFecha, ultima - 1, 1).getValues();
    // De abajo hacia arriba, agrupando filas seguidas para borrar en bloque.
    for (var i = fechas.length - 1; i >= 0; i--) {
      if (!esAnterior(fechas[i][0], limite)) continue;
      var fin = i;
      while (i - 1 >= 0 && esAnterior(fechas[i - 1][0], limite)) i--;
      hoja.deleteRows(i + 2, fin - i + 1);
      borradas += fin - i + 1;
    }
  });
  console.log("Filas borradas por antigüedad: " + borradas);
  return borradas;
}

/** La celda de fecha es anterior al límite. Si no se entiende la fecha, no se borra. */
function esAnterior(valor, limite) {
  var fecha = null;
  if (Object.prototype.toString.call(valor) === "[object Date]") {
    fecha = valor;
  } else {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(texto(valor));
    if (m) fecha = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  }
  return !!fecha && !isNaN(fecha.getTime()) && fecha < limite;
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

function textoPrivacidad(version) {
  var v = texto(version).slice(0, 20);
  return "Sí" + (v ? " (versión " + sanear(v) + ")" : "");
}

/**
 * Manda el aviso por correo. Si falla (por ejemplo, se acabó la cuota diaria
 * de Gmail), el registro ya quedó guardado: solo se anota el error.
 */
function avisar(asunto, lineas) {
  if (!AVISAR_POR_CORREO) return;
  try {
    var para = CORREO_AVISO || Session.getEffectiveUser().getEmail();
    if (!para) return;
    var cuerpo = lineas.concat(["", "Ver la hoja: " + SpreadsheetApp.getActiveSpreadsheet().getUrl()]).join("\n");
    MailApp.sendEmail(para, asunto, cuerpo);
  } catch (err) {
    console.warn("No se pudo mandar el aviso por correo: " + (err && err.message ? err.message : err));
  }
}

/** Manda un correo de prueba a la cuenta dueña del script (también lo hace `configurar`). */
function probarAviso() {
  avisar("Entreobra: prueba de aviso", ["Si te llegó este correo, los avisos de registros nuevos funcionan."]);
}

function responder(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON);
}
