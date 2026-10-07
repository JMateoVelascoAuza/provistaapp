export const ES_EXPORT_ESTATICO = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

/** Build para hosting estático (Namecheap): sin servidor, así que sin /api. */
export const SIN_SERVIDOR = process.env.NEXT_PUBLIC_SIN_SERVIDOR === "1";

/** URL del Google Apps Script que recibe los formularios (vacía en local). */
export const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? "";

/**
 * Los links de Next (`/demo`, `/#formulario`) son rutas absolutas —
 * perfectas con un servidor real, pero rotas si alguien abre el HTML
 * como archivo local (`file://`, sin dominio: `/demo` termina
 * buscando la carpeta `demo` en la raíz del disco). Esta función los
 * reescribe a relativos solo en la build exportada
 * (`STATIC_EXPORT=1`, ver next.config.ts, que también expone
 * `NEXT_PUBLIC_STATIC_EXPORT` al cliente) — en cualquier otro caso los
 * deja intactos.
 */
/**
 * Sin `trailingSlash` (ver next.config.ts), cada ruta exporta como
 * archivo plano en la raíz de /out ("demo.html", "index.html") — todas
 * las páginas quedan al mismo nivel, así que no hace falta calcular
 * ningún "../" según la profundidad de la página actual.
 */
export function enlace(ruta: string): string {
  if (!ES_EXPORT_ESTATICO) return ruta;
  if (ruta === "/demo") return "demo.html";
  if (ruta.startsWith("/#")) return `index.html${ruta.slice(1)}`;
  if (ruta === "/") return "index.html";
  // Páginas legales y cualquier otra ruta de un nivel: "/privacidad" → "privacidad.html".
  if (/^\/[\w-]+$/.test(ruta)) return `${ruta.slice(1)}.html`;
  return ruta;
}
