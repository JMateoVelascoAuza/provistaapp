"use client";

import { useEffect } from "react";

/**
 * Solo en `npm run dev`: desinstala cualquier service worker y vacía su
 * caché. Si antes se corrió `npm run build` + `npm run start` en el
 * mismo puerto, el navegador queda con el service worker de la PWA
 * instalado, y ese worker sirve los `.js` "primero desde caché". En dev
 * los archivos no llevan hash en el nombre (`page.js`), así que tras
 * cada cambio el navegador ejecutaba la versión vieja y la página se
 * rompía de forma intermitente (p. ej. "Element type is invalid" al
 * agregar una sección nueva). En producción este componente no hace
 * nada: la PWA sigue funcionando igual.
 */
export function LimpiarServiceWorkerDev() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || !("serviceWorker" in navigator)) return;

    (async () => {
      const registros = await navigator.serviceWorker.getRegistrations();
      if (registros.length === 0) return;
      await Promise.all(registros.map((registro) => registro.unregister()));
      if ("caches" in window) {
        const nombres = await caches.keys();
        await Promise.all(nombres.map((nombre) => caches.delete(nombre)));
      }
      // Si la página actual vino del worker, recargar una vez para traer
      // el código fresco del servidor de desarrollo.
      if (navigator.serviceWorker.controller) window.location.reload();
    })();
  }, []);

  return null;
}
