"use client";

import { useEffect, useState } from "react";

/**
 * Barra fina que se llena a medida que se hace scroll. Es un indicador,
 * no contenido — arranca en 0% tanto en servidor como en cliente, así
 * que no hay nada que esconder ni ningún riesgo de parpadeo.
 */
export function ScrollProgressBar() {
  const [progreso, setProgreso] = useState(0);

  useEffect(() => {
    function onScroll() {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      setProgreso(alto > 0 ? (window.scrollY / alto) * 100 : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent">
      <div
        className="h-full bg-naranja-600 transition-[width] duration-150 ease-out"
        style={{ width: `${progreso}%` }}
      />
    </div>
  );
}
