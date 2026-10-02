"use client";

import { useEffect, useRef } from "react";

/**
 * Hilo de óxido sobre el header que se llena con el scroll. Escala con
 * `transform` (no `width`) directo sobre el nodo: no re-renderiza React
 * en cada evento de scroll.
 */
export function ScrollProgressBar() {
  const barraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    function actualizar() {
      frame = 0;
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      const progreso = alto > 0 ? window.scrollY / alto : 0;
      if (barraRef.current) barraRef.current.style.transform = `scaleX(${progreso})`;
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(actualizar);
    }
    actualizar();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-px">
      <div ref={barraRef} className="h-full origin-left scale-x-0 bg-oxido" />
    </div>
  );
}
