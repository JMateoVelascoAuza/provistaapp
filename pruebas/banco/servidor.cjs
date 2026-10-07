// Banco de pruebas local de los formularios de Entreobra (npm run banco).
// Con `npm run dev:banco` en otra terminal, la landing también le envía.
// Ejecuta el apps-script/Code.gs REAL (se relee en cada envío) contra una hoja
// simulada con las mismas columnas que la del cliente, y muestra la hoja y los
// correos de aviso en http://localhost:5050/hoja (se actualiza sola).
const http = require("http"), fs = require("fs"), path = require("path"), vm = require("vm");

const PROYECTO = path.resolve(__dirname, "..", "..");
const CODIGO = path.join(PROYECTO, "apps-script/Code.gs");
const DATOS = path.join(__dirname, "hoja-prueba.json");
const PUERTO = 5050;
const SITIO = "http://localhost:3000";
const CLIENTE = ["Fecha", "Ferreteria", "Contacto", "WhatsApp", "Zona", "Correo", "Categoria", "Material", "Medida/variante", "Marca", "Unidad", "Precio (Bs)", "Stock (Si/No)", "Entrega a obra (Si/No)"];

// ---------- Hoja simulada (persistida en hoja-prueba.json) ----------
function estadoInicial() { return { hojas: { "Hoja 1": [CLIENTE.slice()] }, orden: ["Hoja 1"], correos: [], envios: [] }; }
let estado = fs.existsSync(DATOS) ? JSON.parse(fs.readFileSync(DATOS, "utf8")) : estadoInicial();
const guardar = () => fs.writeFileSync(DATOS, JSON.stringify(estado, null, 1));

function hoja(nombre) {
  const datos = estado.hojas[nombre];
  const celda = (f, c) => ({
    getValue: () => (datos[f - 1] || [])[c - 1] ?? "",
    setValue: (v) => { datos[f - 1] = datos[f - 1] || []; datos[f - 1][c - 1] = v; return { setFontWeight() {} }; },
    setFontWeight() { return this; },
  });
  return {
    getName: () => nombre,
    getLastRow: () => datos.length,
    getLastColumn: () => Math.max(0, ...datos.map((r) => r.length)),
    setFrozenRows() {},
    getRange: (f, c, nf, nc) => (nf === undefined ? celda(f, c) : {
      setValues: (v) => { v.forEach((r, i) => { const fila = (datos[f - 1 + i] = datos[f - 1 + i] || []); r.forEach((x, j) => { fila[c - 1 + j] = x; }); }); return { setFontWeight() {} }; },
      getValues: () => datos.slice(f - 1, f - 1 + nf).map((r) => { const o = []; for (let j = 0; j < nc; j++) o.push(r[c - 1 + j] ?? ""); return o; }),
    }),
  };
}

function fechaLaPaz(d) {
  const x = new Date(d.getTime() - 4 * 3600 * 1000); // America/La_Paz, UTC-4 sin horario de verano
  const p = (n) => String(n).padStart(2, "0");
  return `${x.getUTCFullYear()}-${p(x.getUTCMonth() + 1)}-${p(x.getUTCDate())} ${p(x.getUTCHours())}:${p(x.getUTCMinutes())}:${p(x.getUTCSeconds())}`;
}

// Caché de Apps Script (límite de envíos por hora), en memoria mientras corre el banco.
const cache = new Map();

function ejecutar(funcion, evento) {
  const ctx = {
    CacheService: { getScriptCache: () => ({ get: (k) => (cache.has(k) ? cache.get(k) : null), put: (k, v) => cache.set(k, v) }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => ({
      getUrl: () => `http://localhost:${PUERTO}/hoja`,
      getSheetByName: (n) => (estado.hojas[n] ? hoja(n) : null),
      insertSheet: (n) => { estado.hojas[n] = []; estado.orden.push(n); return hoja(n); },
    }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    Utilities: { formatDate: (d) => fechaLaPaz(d) },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: (t) => ({ t, setMimeType() { return this; } }) },
    Session: { getEffectiveUser: () => ({ getEmail: () => "cuenta-del-cliente@gmail.com" }) },
    MailApp: { sendEmail: (para, asunto, cuerpo) => estado.correos.unshift({ hora: fechaLaPaz(new Date()), para, asunto, cuerpo }) },
    console: { log: () => {}, warn: (m) => console.warn("[Code.gs]", m) },
  };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(CODIGO, "utf8"), ctx); // siempre la versión actual del script
  return ctx[funcion](evento);
}

// ---------- HTTP ----------
const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "content-type" };

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PUERTO}`);
  if (req.method === "OPTIONS") { res.writeHead(204, CORS); return res.end(); }

  if (url.pathname === "/exec" && req.method === "GET") {
    res.writeHead(200, { ...CORS, "content-type": "application/json" });
    return res.end(ejecutar("doGet").t);
  }
  if (url.pathname === "/exec" && req.method === "POST") {
    let cuerpo = "";
    req.on("data", (c) => (cuerpo += c));
    req.on("end", () => {
      let respuesta;
      try { respuesta = ejecutar("doPost", { postData: { contents: cuerpo } }).t; }
      catch (e) { respuesta = JSON.stringify({ ok: false, error: "Error en Code.gs: " + e.message }); }
      let datos = {}; try { datos = JSON.parse(cuerpo); } catch {}
      estado.envios.unshift({ hora: fechaLaPaz(new Date()), formulario: datos.tipo === "acceso" ? "Acceso anticipado" : "Registro de productos", respuesta: JSON.parse(respuesta) });
      guardar();
      console.log(`[envío] ${estado.envios[0].formulario} → ${respuesta}`);
      res.writeHead(200, { ...CORS, "content-type": "application/json" });
      res.end(respuesta);
    });
    return;
  }
  if (url.pathname === "/estado.json") {
    res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
    return res.end(JSON.stringify(estado));
  }
  if (url.pathname === "/reiniciar" && req.method === "POST") {
    estado = estadoInicial(); cache.clear(); guardar();
    res.writeHead(200); return res.end("ok");
  }
  if (url.pathname === "/hoja" || url.pathname === "/") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    return res.end(fs.readFileSync(path.join(__dirname, "hoja.html")));
  }
  // Página de registro real, apuntando a este banco de pruebas.
  if (url.pathname === "/registro/" || url.pathname === "/registro/index.html") {
    const html = fs.readFileSync(path.join(PROYECTO, "registro/index.html"), "utf8")
      .replace('APPS_SCRIPT_URL: "",', `APPS_SCRIPT_URL: "http://localhost:${PUERTO}/exec",`);
    res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
    return res.end(html);
  }
  if (url.pathname.startsWith("/fuentes/")) {
    const f = path.join(PROYECTO, "public", url.pathname);
    if (fs.existsSync(f)) { res.writeHead(200, { "content-type": "font/woff2" }); return res.end(fs.readFileSync(f)); }
  }
  // Lo demás (páginas legales enlazadas desde el registro) vive en el sitio.
  res.writeHead(302, { location: SITIO + url.pathname }); res.end();
}).listen(PUERTO, () => console.log(`Banco de pruebas: hoja en http://localhost:${PUERTO}/hoja · registro en http://localhost:${PUERTO}/registro/`));
