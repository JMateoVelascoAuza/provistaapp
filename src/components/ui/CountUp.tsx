"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export function CountUp({
  value,
  duration = 1400,
  retraso = 0,
  desde = 0,
  formatter = (n: number) => String(n),
}: {
  value: number;
  duration?: number;
  retraso?: number;
  desde?: number;
  formatter?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(value);
  const reducido = usePrefersReducedMotion();

  useEffect(() => {
    if (reducido || value === 0) {
      setDisplay(value);
      return;
    }
    let frame: number;
    let inicio: number | null = null;

    function tick(ahora: number) {
      inicio ??= ahora + retraso;
      const progreso = Math.min(Math.max((ahora - inicio) / duration, 0), 1);
      const facilitado = 1 - Math.pow(1 - progreso, 4);
      setDisplay(Math.round(desde + facilitado * (value - desde)));
      if (progreso < 1) frame = requestAnimationFrame(tick);
    }

    setDisplay(desde);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, retraso, desde, reducido]);

  return <>{formatter(display)}</>;
}
