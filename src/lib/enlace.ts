export const ES_EXPORT_ESTATICO = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export const SIN_SERVIDOR = process.env.NEXT_PUBLIC_SIN_SERVIDOR === "1";

export const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ?? "";

export function enlace(ruta: string): string {
  if (!ES_EXPORT_ESTATICO) return ruta;
  if (ruta === "/demo") return "demo.html";
  if (ruta.startsWith("/#")) return `index.html${ruta.slice(1)}`;
  if (ruta === "/") return "index.html";
  if (/^\/[\w-]+$/.test(ruta)) return `${ruta.slice(1)}.html`;
  return ruta;
}
