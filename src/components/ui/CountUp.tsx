"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Cuenta de 0 al valor final al montar (tras `retraso` ms). El servidor
 * manda el valor final directo (sin JS no hay animación, pero el número
 * correcto igual se ve) — el conteo es un efecto visual encima, no un
 * gate de visibilidad del contenido.
 *
 * Sin guardas de "ya corrí" con useRef: en StrictMode (dev) el efecto
 * se invoca, limpia y vuelve a invocar — una guarda así deja el segundo
 * montaje sin arrancar y el número pegado en 0. La limpieza de abajo ya
 * cancela el frame viejo correctamente.
 */
export function CountUp({
  value,
  duration = 1400,
  retraso = 0,
  formatter = (n: number) => String(n),
}: {
  value: number;
  duration?: number;
  retraso?: number;
  formatter?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(value);
  const reducido = usePrefersReducedMotion();

  useEffect(() => {
    if (reducido || value === 0) return;
    let frame: number;
    let inicio: number | null = null;

    function tick(ahora: number) {
      inicio ??= ahora + retraso;
      const progreso = Math.min(Math.max((ahora - inicio) / duration, 0), 1);
      const facilitado = 1 - Math.pow(1 - progreso, 4);
      setDisplay(Math.round(facilitado * value));
      if (progreso < 1) frame = requestAnimationFrame(tick);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplay(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, retraso, reducido]);

  return <>{formatter(display)}</>;
}
