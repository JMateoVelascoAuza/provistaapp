"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Arranca todo en `false` (igual en servidor y en el primer render del
 * cliente) y recién se confirma en un `useEffect`, post-montaje — el
 * mismo patrón que `usePrefersReducedMotion`, para no volver
 * a pisar el bug de hydration mismatch que ya encontramos ahí.
 */
export function usePwaInstall() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [instalada, setInstalada] = useState(false);
  const [esIOS, setEsIOS] = useState(false);

  useEffect(() => {
    const enStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    // Deliberado: tiene que arrancar igual en servidor y cliente (ver
    // comentario arriba), así que confirmarlo recién montado es la única
    // opción sin reintroducir el mismatch de hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInstalada(enStandalone);
    setEsIOS(/iphone|ipad|ipod/i.test(window.navigator.userAgent));

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredEvent(e as BeforeInstallPromptEvent);
    }
    function onAppInstalled() {
      setInstalada(true);
      setDeferredEvent(null);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  async function instalar() {
    if (!deferredEvent) return false;
    await deferredEvent.prompt();
    const eleccion = await deferredEvent.userChoice;
    setDeferredEvent(null);
    return eleccion.outcome === "accepted";
  }

  return {
    // Chrome/Edge/Android avisan con este evento cuando el navegador
    // mismo cree que la app es instalable — ahí sí hay un botón nativo
    // real que disparar (`instalar()`).
    puedeInstalarNativo: !!deferredEvent,
    instalada,
    // Safari en iOS nunca dispara `beforeinstallprompt` (no lo
    // implementa) — ahí la única vía es explicarle al usuario los pasos
    // manuales (compartir → agregar a pantalla de inicio).
    esIOS,
    instalar,
  };
}
