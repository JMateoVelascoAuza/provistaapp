"use client";

import { useEffect } from "react";

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
      if (navigator.serviceWorker.controller) window.location.reload();
    })();
  }, []);

  return null;
}
