"use client";

import { useSyncExternalStore } from "react";

/**
 * Los `@media (prefers-reduced-motion: reduce)` en `globals.css` ya
 * frenan las animaciones CSS puras, pero no alcanzan a las secuencias
 * armadas con GSAP/ScrollTrigger (pin, scrub, zoom) — esas se arman en
 * JS y necesitan chequear la preferencia ellas mismas para caer a algo
 * simple (fade corto, sin pin ni scrub) en vez de saltarse el pedido
 * del usuario.
 *
 * useSyncExternalStore y no un useState inicializado con matchMedia:
 * durante la hidratación React usa el valor del servidor (false) y
 * recién después el real. Así el HTML del servidor y el primer render
 * del navegador coinciden; si no, React reconstruía la página entera y
 * se perdían el tema y el idioma aplicados antes de hidratar.
 */
const CONSULTA = "(prefers-reduced-motion: reduce)";

function suscribir(avisar: () => void) {
  const media = window.matchMedia(CONSULTA);
  media.addEventListener("change", avisar);
  return () => media.removeEventListener("change", avisar);
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CONSULTA).matches,
    () => false,
  );
}
