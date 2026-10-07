// Prueba del Apps Script (apps-script/Code.gs) sin Google: lo ejecuta contra
// una hoja, Gmail, caché y activadores simulados. Uso: npm run prueba:script
const fs = require("fs"); const path = require("path"); const vm = require("vm");
const codigo = fs.readFileSync(path.join(__dirname, "..", "apps-script", "Code.gs"), "utf8");
const CLIENTE = ["Fecha","Ferreteria","Contacto","WhatsApp","Zona","Correo","Categoria","Material","Medida/variante","Marca","Unidad","Precio (Bs)","Stock (Si/No)","Entrega a obra (Si/No)"];
const formatos = []; const validaciones = []; const protecciones = [];
function crearHoja(nombre, inicial) {
  const datos = inicial ? inicial.map((r) => r.slice()) : [];
  const propias = [];
  const rango = (f, c, nf = 1, nc = 1) => ({
    getValue: () => (datos[f - 1] || [])[c - 1] ?? "",
    setValue: (v) => { datos[f - 1] = datos[f - 1] || []; datos[f - 1][c - 1] = v; return { setFontWeight() {} }; },
    setValues: (v) => { v.forEach((r, i) => { datos[f - 1 + i] = datos[f - 1 + i] || []; r.forEach((x, j) => { datos[f - 1 + i][c - 1 + j] = x; }); }); return { setFontWeight() {} }; },
    getValues: () => datos.slice(f - 1, f - 1 + nf).map((r) => { const o = []; for (let j = 0; j < nc; j++) o.push(r[c - 1 + j] ?? ""); return o; }),
    setFontWeight() { return this; },
    setNumberFormat: (fmt) => { formatos.push({ hoja: nombre, col: c, fmt }); },
    setDataValidation: (v) => { validaciones.push({ hoja: nombre, col: c, v }); },
    protect: () => {
      const p = { descripcion: "", soloAviso: false, hoja: nombre, ancho: nc,
        setDescription(d) { this.descripcion = d; return this; }, setWarningOnly(w) { this.soloAviso = w; return this; },
        getDescription() { return this.descripcion; }, remove() { propias.splice(propias.indexOf(p), 1); protecciones.splice(protecciones.indexOf(p), 1); } };
      propias.push(p); protecciones.push(p); return p;
    },
  });
  return {
    nombre, datos,
    getLastRow: () => datos.length,
    getLastColumn: () => Math.max(0, ...datos.map((r) => r.length)),
    getMaxRows: () => 1000,
    setFrozenRows() {},
    deleteRows: (f, n) => { datos.splice(f - 1, n); },
    getProtections: () => propias.slice(),
    getRange: rango,
  };
}
const libro = { hojas: { "Hoja 1": crearHoja("Hoja 1", [CLIENTE]) } };
const correos = []; let gmailFalla = false;
const cache = new Map();
const activadores = [];
const ctx = {
  SpreadsheetApp: {
    getActiveSpreadsheet: () => ({ getUrl: () => "https://docs.google.com/spreadsheets/d/HOJA", getSheetByName: (n) => libro.hojas[n] || null, insertSheet: (n) => (libro.hojas[n] = crearHoja(n)) }),
    newDataValidation: () => { const v = {}; const b = { requireValueInList(l, d) { v.lista = l; v.desplegable = d; return b; }, setAllowInvalid(a) { v.permiteInvalido = a; return b; }, build: () => v }; return b; },
    ProtectionType: { RANGE: "RANGE" },
  },
  ScriptApp: {
    getProjectTriggers: () => activadores.slice(),
    deleteTrigger: (t) => activadores.splice(activadores.indexOf(t), 1),
    newTrigger: (funcion) => { const t = { funcion, getHandlerFunction: () => funcion }; const b = { timeBased: () => b, everyDays(d) { t.dias = d; return b; }, atHour(h) { t.hora = h; return b; }, inTimezone(z) { t.zona = z; return b; }, create: () => { activadores.push(t); return t; } }; return b; },
  },
  CacheService: { getScriptCache: () => ({ get: (k) => (cache.has(k) ? cache.get(k) : null), put: (k, v) => cache.set(k, v) }) },
  Session: { getEffectiveUser: () => ({ getEmail: () => "duenio@gmail.com" }) },
  MailApp: { sendEmail: (para, asunto, cuerpo) => { if (gmailFalla) throw new Error("Service invoked too many times"); correos.push({ para, asunto, cuerpo }); } },
  console: { warn: () => {}, log: () => {} },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  Utilities: { formatDate: (d, tz) => `FECHA(${tz})` },
  ContentService: { MimeType: { JSON: "json" }, createTextOutput: (t) => ({ t, setMimeType() { return this; } }) },
};
vm.createContext(ctx); vm.runInContext(codigo, ctx);
const postTexto = (t) => JSON.parse(ctx.doPost({ postData: { contents: t } }).t);
const post = (o) => postTexto(JSON.stringify(o));
const r = []; const ok = (c, m) => r.push(`${c ? "OK   " : "FALLA"} ${m}`);
const C = { consentimiento: true, versionPoliticas: "2026-10-04" };
const base = () => ({ id: "abc-123", enviadoEn: "x", honeypot: "", version: 1, ...C,
  ferreteria: { negocio: "Ferretería A", contacto: "Moisés", whatsapp: "+59176712345", zona: "Cercado", correo: "" },
  productos: [
    { categoria: "Cemento", material: "Cemento IP-30", medida: "50 kg", marca: "Viacha", unidad: "bolsa", precio: 62, stock: "Sí", entrega: "No" },
    { categoria: "Otros", material: "=HYPERLINK(1)", medida: "", marca: "@x", unidad: "pieza", precio: 1.5, stock: "", entrega: "" },
  ] });
const h = libro.hojas["Hoja 1"];
const COLS = [...CLIENTE, "ID envío", "Acepta privacidad"];

// --- Consentimiento ---
const sinC = base(); delete sinC.consentimiento;
let res = post(sinC);
ok(res.ok === false && h.datos.length === 1 && /Política de privacidad/.test(res.error), `productos sin consentimiento: rechaza y no escribe (${res.error})`);
const cFalso = base(); cFalso.consentimiento = "true";
res = post(cFalso); ok(res.ok === false && h.datos.length === 1, "consentimiento 'true' (texto) no vale: tiene que ser true");

// --- Envío normal ---
res = post(base());
ok(res.ok && res.filas === 2, `envío: ${JSON.stringify(res)}`);
ok(correos.length === 1 && correos[0].para === "duenio@gmail.com" && correos[0].asunto === "Entreobra: Ferretería A envió 2 productos" && /Ver la hoja: https:/.test(correos[0].cuerpo) && correos[0].cuerpo.includes("\nZona: Cercado\n"), `aviso de productos por correo: "${correos[0] && correos[0].asunto}"`);
ok(Object.keys(libro.hojas).join() === "Hoja 1", "escribe en la Hoja 1 del cliente (no crea otra)");
ok(h.datos[0].join("|") === COLS.join("|"), "Hoja 1 conserva sus 14 columnas y agrega 'ID envío' y 'Acepta privacidad' al final");
ok(h.datos[1].join("|") === "FECHA(America/La_Paz)|Ferretería A|Moisés|'+591 76712345|Cercado||Cemento|Cemento IP-30|50 kg|Viacha|bolsa|62|Sí|No|abc-123|Sí (versión 2026-10-04)", `fila en el orden del cliente: ${h.datos[1].join("|")}`);
ok(h.datos[2][7] === "'=HYPERLINK(1)" && h.datos[2][9] === "'@x", "fórmulas neutralizadas");
res = post(base()); ok(res.duplicado === true && h.datos.length === 3 && correos.length === 1, "mismo ID: no duplica ni vuelve a avisar");
const bot = base(); bot.id = "bot"; bot.honeypot = "x"; delete bot.consentimiento;
res = post(bot); ok(res.ok === true && h.datos.length === 3, "honeypot: responde ok sin escribir");

// --- (5) Validación y normalización ---
const norm = base(); norm.id = "norm-1"; norm.ferreteria.whatsapp = "7697-1774";
norm.productos = [{ categoria: "cemento", material: "Cemento", medida: "", marca: "", unidad: "BOLSA", precio: 10.456, stock: "si", entrega: "NO" }];
res = post(norm); const filaN = h.datos[h.datos.length - 1];
ok(res.ok && filaN[3] === "'+591 76971774" && filaN[6] === "Cemento" && filaN[10] === "bolsa" && filaN[11] === 10.46 && filaN[12] === "Sí" && filaN[13] === "No",
  `normaliza teléfono, categoría, unidad, Sí/No y redondea el precio: ${filaN.join("|")}`);
const malo = (cambio, nombre) => { const e = base(); e.id = "malo-" + nombre; cambio(e); const n = h.datos.length; const x = post(e); ok(x.ok === false && h.datos.length === n, `rechaza ${nombre} (${x.error})`); };
malo((e) => { e.productos[0].categoria = "Eléctricos"; }, "categoría fuera de la lista");
malo((e) => { e.productos[0].unidad = "caja"; }, "unidad fuera de la lista");
malo((e) => { e.productos[0].stock = "quizás"; }, "Sí/No inválido");
malo((e) => { e.ferreteria.whatsapp = "12345"; }, "WhatsApp inválido");
malo((e) => { e.ferreteria.correo = "sin-arroba"; }, "correo inválido");
malo((e) => { e.productos[0].precio = "62"; }, "precio como texto");
malo((e) => { e.productos[0].precio = 0; }, "precio 0");

// --- (1) Columnas por nombre ---
libro.hojas["Hoja 1"] = crearHoja("Hoja 1", [["Fecha", "Notas del cliente", "Material", "Ferreteria", "Precio (Bs)", "ID envío"], ["F0", "nota", "Viejo", "X", 1, "old"]]);
const hM = libro.hojas["Hoja 1"];
const mov = base(); mov.id = "mov-1"; mov.ferreteria.whatsapp = "+59170000001";
res = post(mov);
const cab = hM.datos[0]; const fila = hM.datos[2]; const en = (n) => fila[cab.indexOf(n)];
ok(res.ok && en("Material") === "Cemento IP-30" && en("Ferreteria") === "Ferretería A" && en("Precio (Bs)") === 62 && en("Notas del cliente") === "" && en("ID envío") === "mov-1",
  "columnas movidas: cada dato cae en la columna con su nombre");
ok(cab.slice(0, 6).join("|") === "Fecha|Notas del cliente|Material|Ferreteria|Precio (Bs)|ID envío" && cab.includes("Zona") && cab.includes("Acepta privacidad") && hM.datos[1].join("|") === "F0|nota|Viejo|X|1|old",
  "columnas que faltan se agregan al final sin mover ni tocar lo anterior");
res = post(mov); ok(res.duplicado === true, "columnas movidas: encuentra el ID por nombre (no duplica)");
libro.hojas["Hoja 1"] = h;

// --- Acceso anticipado (pestaña nueva) ---
let a = post({ tipo: "acceso", id: "acc-0", nombre: "Sin Permiso", whatsapp: "+591 70000000", tipoUsuario: "obra" });
ok(a.ok === false && !libro.hojas["Acceso anticipado"], "acceso sin consentimiento: rechaza y no crea la pestaña");
a = post({ tipo: "acceso", id: "acc-1", nombre: "Juan Pérez", whatsapp: "70000000", tipoUsuario: "obra", ...C });
const hA = libro.hojas["Acceso anticipado"];
ok(a.ok && hA.datos[0].join("|") === "Fecha|Nombre|Participa como|WhatsApp|Acepta privacidad|ID envío", "acceso: crea la pestaña con 'Acepta privacidad'");
ok(hA.datos[1].join("|") === "FECHA(America/La_Paz)|Juan Pérez|Estoy en obra|'+591 70000000|Sí (versión 2026-10-04)|acc-1", `acceso: fila con WhatsApp normalizado ${hA.datos[1].join("|")}`);
const ultimo = correos[correos.length - 1];
ok(ultimo.asunto === "Entreobra: nuevo acceso anticipado — Juan Pérez" && /WhatsApp: \+591 70000000/.test(ultimo.cuerpo), `aviso de acceso por correo: "${ultimo.asunto}"`);
gmailFalla = true;
a = post({ tipo: "acceso", id: "acc-9", nombre: "Sin Gmail", whatsapp: "+591 79999999", tipoUsuario: "proveedor", ...C });
ok(a.ok === true && hA.datos.length === 3, "si Gmail falla, el registro igual se guarda");
gmailFalla = false;
a = post({ tipo: "acceso", id: "acc-1", nombre: "Juan Pérez", whatsapp: "+591 70000000", tipoUsuario: "obra", ...C });
ok(a.duplicado === true && hA.datos.length === 3, "acceso: mismo ID no duplica");
a = post({ tipo: "acceso", id: "acc-x", nombre: "Raro", whatsapp: "(4) 4251234", tipoUsuario: "obra", ...C });
ok(a.ok && hA.datos[hA.datos.length - 1][3] === "(4) 4251234", "acceso: un número que no se reconoce se guarda tal cual (la landing no lo valida)");
ctx.probarAviso(); ok(correos[correos.length - 1].asunto === "Entreobra: prueba de aviso", "probarAviso() manda el correo de prueba");
a = post({ tipo: "acceso", id: "acc-2", nombre: "", whatsapp: "1", tipoUsuario: "obra", ...C });
ok(a.ok === false, `acceso: rechaza incompleto (${a.error})`);

// --- Acceso anticipado creado con la versión anterior (5 columnas) ---
libro.hojas["Acceso anticipado"] = crearHoja("Acceso anticipado", [
  ["Fecha", "Nombre", "Participa como", "WhatsApp", "ID envío"],
  ["F0", "Viejo", "Estoy en obra", "'+591 1", "old-1"],
]);
const hV = libro.hojas["Acceso anticipado"];
a = post({ tipo: "acceso", id: "old-1", nombre: "Viejo", whatsapp: "+591 1", tipoUsuario: "obra", ...C });
ok(a.duplicado === true, "hoja vieja: encuentra el ID en su columna por nombre (no duplica)");
ok(hV.datos[0].join("|") === "Fecha|Nombre|Participa como|WhatsApp|ID envío|Acepta privacidad", "hoja vieja: agrega 'Acepta privacidad' al final sin mover nada");
a = post({ tipo: "acceso", id: "new-2", nombre: "Nueva", whatsapp: "+591 2", tipoUsuario: "proveedor", ...C });
ok(a.ok && hV.datos[2].join("|") === "FECHA(America/La_Paz)|Nueva|Vendo materiales|'+591 2|new-2|Sí (versión 2026-10-04)", `hoja vieja: fila nueva en su lugar ${hV.datos[2].join("|")}`);
ok(hV.datos[1].join("|") === "F0|Viejo|Estoy en obra|'+591 1|old-1", "hoja vieja: filas anteriores intactas");

// --- (4) Límite contra spam ---
cache.clear();
const spam = (i) => { const e = base(); e.id = "spam-" + i; e.ferreteria.whatsapp = "+59177777777"; e.productos = [e.productos[0]]; return post(e); };
let aceptados = 0; for (let i = 0; i < 10; i++) if (spam(i).ok) aceptados++;
const n11 = h.datos.length; res = spam(10);
ok(aceptados === 10 && res.ok === false && /muchos envíos/.test(res.error) && h.datos.length === n11, `límite por número: 10 por hora, el 11.º se rechaza (${res.error})`);
res = spam(3); ok(res.duplicado === true, "límite: reenviar una lista que ya llegó sigue respondiendo ok (duplicado)");
const otro = base(); otro.id = "spam-otro"; otro.ferreteria.whatsapp = "+59166666666";
res = post(otro); ok(res.ok === true, "límite: otro número sí puede enviar");
cache.set("envios:total", "300");
const total = base(); total.id = "spam-total"; total.ferreteria.whatsapp = "+59165555555";
res = post(total); ok(res.ok === false && /muchos envíos/.test(res.error), "límite total: 300 por hora entre todos");
cache.clear();
ctx.CacheService = undefined;
const sinCache = base(); sinCache.id = "sin-cache";
res = post(sinCache); ok(res.ok === true, "si la caché de Google falla, el envío igual se guarda");
ctx.CacheService = { getScriptCache: () => ({ get: (k) => (cache.has(k) ? cache.get(k) : null), put: (k, v) => cache.set(k, v) }) };
res = postTexto(JSON.stringify({ ...base(), id: "grande", relleno: "x".repeat(400001) }));
ok(res.ok === false && /demasiado grande/.test(res.error), "rechaza un envío de más de 400.000 caracteres");

// --- (6) configurar ---
const antesCorreos = correos.length;
ctx.configurar(); ctx.configurar();
ok(activadores.length === 1 && activadores[0].funcion === "borrarAntiguos" && activadores[0].dias === 1 && activadores[0].zona === "America/La_Paz", "configurar: programa el borrado diario una sola vez aunque se ejecute dos veces");
ok(correos.length === antesCorreos + 2 && correos[correos.length - 1].asunto === "Entreobra: prueba de aviso", "configurar: manda el correo de prueba");
const colDe = (hoja, n) => libro.hojas[hoja].datos[0].indexOf(n) + 1;
ok(formatos.some((f) => f.hoja === "Hoja 1" && f.col === colDe("Hoja 1", "Precio (Bs)") && f.fmt === "#,##0.00") && formatos.some((f) => f.hoja === "Hoja 1" && f.col === 1 && /yyyy-mm-dd/.test(f.fmt)), "configurar: formato de fecha y de precio con 2 decimales");
const vSiNo = validaciones.filter((v) => v.hoja === "Hoja 1");
ok(vSiNo.length >= 2 && vSiNo.some((v) => v.col === colDe("Hoja 1", "Stock (Si/No)")) && vSiNo.some((v) => v.col === colDe("Hoja 1", "Entrega a obra (Si/No)")) && vSiNo.every((v) => v.v.lista.join() === "Sí,No"), "configurar: lista desplegable Sí/No en Stock y Entrega");
const pH = protecciones.filter((p) => p.hoja === "Hoja 1"); const pA = protecciones.filter((p) => p.hoja === "Acceso anticipado");
ok(pH.length === 1 && pH[0].soloAviso === true && pH[0].ancho === 16 && pA.length === 1, "configurar: encabezados protegidos (solo aviso), sin duplicar la protección");

// --- (3) Borrado de datos viejos ---
const viejo = new Date(); viejo.setMonth(viejo.getMonth() - 25);
const reciente = new Date(); reciente.setMonth(reciente.getMonth() - 23);
const iso = (d) => d.toISOString().slice(0, 10) + " 10:00:00";
libro.hojas["Hoja 1"] = crearHoja("Hoja 1", [COLS,
  [iso(viejo), "Vieja 1"], [viejo, "Vieja 2 (fecha real)"], [iso(reciente), "Reciente"], [iso(viejo), "Vieja 3"], ["fecha rara", "Sin fecha"],
]);
libro.hojas["Acceso anticipado"] = crearHoja("Acceso anticipado", [["Fecha", "Nombre"], [iso(viejo), "A viejo"], [iso(reciente), "A nuevo"]]);
const borradas = ctx.borrarAntiguos();
ok(borradas === 4 && libro.hojas["Hoja 1"].datos.map((f) => f[1]).join("|") === "Ferreteria|Reciente|Sin fecha" && libro.hojas["Acceso anticipado"].datos.map((f) => f[1]).join("|") === "Nombre|A nuevo",
  `borrarAntiguos: borra solo lo de más de 24 meses en las dos pestañas (borró ${borradas})`);

console.log(r.join("\n"));
const fallas = r.filter((x) => x.startsWith("FALLA")).length;
console.log(`${fallas} fallas de ${r.length}`);
process.exit(fallas ? 1 : 0);
