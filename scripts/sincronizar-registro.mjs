// Copia registro/index.html a public/registro/index.html (lo que se publica)
// y le escribe la URL del Google Apps Script, la misma que usa la landing:
// NEXT_PUBLIC_APPS_SCRIPT_URL en .env.production.local / .env.local.
// Corre solo antes de `npm run dev` y de cada build (ver package.json).
import fs from "node:fs";
import path from "node:path";

const raiz = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");

function leerEnv(nombre) {
  const ruta = path.join(raiz, nombre);
  if (!fs.existsSync(ruta)) return {};
  const vars = {};
  for (const linea of fs.readFileSync(ruta, "utf8").split(/\r?\n/)) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) vars[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return vars;
}

const esBuild = process.env.npm_lifecycle_event?.startsWith("prebuild");
const env = {
  ...leerEnv(".env"),
  ...(esBuild ? leerEnv(".env.production") : leerEnv(".env.development")),
  ...leerEnv(".env.local"),
  ...(esBuild ? leerEnv(".env.production.local") : {}),
  ...process.env,
};
const url = (env.NEXT_PUBLIC_APPS_SCRIPT_URL || "").trim();
if (url && !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url)) {
  console.error(`[registro] NEXT_PUBLIC_APPS_SCRIPT_URL no parece una URL de Apps Script: ${url}`);
  process.exit(1);
}

const origen = fs.readFileSync(path.join(raiz, "registro/index.html"), "utf8");
const marca = 'APPS_SCRIPT_URL: "",';
if (!origen.includes(marca)) {
  console.error('[registro] registro/index.html debe tener APPS_SCRIPT_URL: "" (la URL se agrega al publicar).');
  process.exit(1);
}
const destino = path.join(raiz, "public/registro/index.html");
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.writeFileSync(destino, url ? origen.replace(marca, `APPS_SCRIPT_URL: "${url}",`) : origen);
console.log(`[registro] public/registro/index.html actualizado (${url ? "envía a la hoja de Google" : "sin URL: modo CSV + WhatsApp"}).`);
