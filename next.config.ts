import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// `STATIC_EXPORT=1 npm run build` genera HTML/CSS/JS 100% estáticos en
// /out — para mandarle una carpeta al cliente que abre con doble clic
// en index.html, sin servidor ni instalar nada. El flujo normal de
// dev/build (con la API de /api/registro) queda intacto sin esa
// variable — nunca la necesita.
const exportEstatico = process.env.STATIC_EXPORT === "1";
// `STATIC_EXPORT=hosting` (npm run build:hosting): build de producción
// para un hosting estático como Namecheap. Rutas normales con barra final
// (/demo/, /registro/), PWA activa y sin /api (los formularios envían
// directo al Google Apps Script de NEXT_PUBLIC_APPS_SCRIPT_URL).
const exportHosting = process.env.STATIC_EXPORT === "hosting";

const nextConfig: NextConfig = {
  // Expone la misma bandera al cliente (`src/lib/enlace.ts` la usa para
  // reescribir los links de "/demo", "/#formulario", etc. a relativos)
  // — así con UNA sola variable (`STATIC_EXPORT=1`) alcanza para todo.
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: exportEstatico ? "1" : "0",
    NEXT_PUBLIC_SIN_SERVIDOR: exportEstatico || exportHosting ? "1" : "0",
  },
  ...(exportHosting ? { output: "export", images: { unoptimized: true }, trailingSlash: true } : {}),
  ...(exportEstatico
    ? {
        output: "export",
        images: { unoptimized: true },
        // Next.js por defecto arma las URLs de assets como rutas
        // absolutas ("/​_next/..."), que solo funcionan si hay un
        // dominio detrás. Abriendo el HTML como archivo local
        // (file://) eso rompe todo (busca "C:/_next/..."). `"."` las
        // vuelve relativas a la carpeta del HTML, que sí funciona sin
        // servidor.
        assetPrefix: ".",
        // Sin trailingSlash: cada ruta exporta como archivo plano en
        // la raíz de /out ("demo.html", no "demo/index.html"). Todas
        // las páginas quedan al mismo nivel de profundidad, así el
        // "." de assetPrefix arriba resuelve igual para todas — con
        // trailingSlash:true, "/demo" pasa a ser una carpeta un nivel
        // más profundo, y ese mismo "." ya no alcanza para sus propios
        // assets (_next/static/...), que terminan buscándose dentro de
        // esa carpeta en vez de la raíz real.
      }
    : {}),
};

const withPWA = withPWAInit({
  dest: "public",
  // Los service workers no pueden registrarse bajo `file://` (el
  // navegador rechaza el origen "null") — sin esto, la build estática
  // abierta con doble clic tira un error en consola apenas carga.
  disable: process.env.NODE_ENV === "development" || exportEstatico,
  register: true,
  cacheOnFrontEndNav: true,
});

export default withPWA(nextConfig);
