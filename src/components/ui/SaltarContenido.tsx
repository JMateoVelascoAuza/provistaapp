"use client";

import { useIdioma } from "@/lib/preferencias";

/** Primer elemento con Tab: lleva al contenido principal sin recorrer el menú. */
export function SaltarContenido() {
  const { t } = useIdioma();
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-yeso focus:px-5 focus:py-3 focus:text-sm focus:text-carbon"
    >
      {t.saltarContenido}
    </a>
  );
}
