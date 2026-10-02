"use client";

import { useEffect, useState } from "react";

/**
 * Los `@media (prefers-reduced-motion: reduce)` en `globals.css` ya
 * frenan las animaciones CSS puras, pero no alcanzan a las secuencias
 * armadas con GSAP/ScrollTrigger (pin, scrub, zoom) — esas se arman en
 * JS y necesitan chequear la preferencia ellas mismas para caer a algo
 * simple (fade corto, sin pin ni scrub) en vez de saltarse el pedido
 * del usuario.
 */
export function usePrefersReducedMotion() {
  const [reducido, setReducido] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducido(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reducido;
}
