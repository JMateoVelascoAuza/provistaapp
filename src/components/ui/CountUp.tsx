"use client";

import { useEffect, useState } from "react";

/**
 * Cuenta de 0 al valor final al montar. El servidor manda el valor
 * final directo (sin JS no hay animación, pero el número correcto
 * igual se ve) — el conteo desde 0 es un efecto visual que se monta
 * encima, no un gate de visibilidad del contenido.
 *
 * Sin guardas de "ya corrí" con useRef: en React StrictMode (dev) el
 * efecto se invoca, limpia y vuelve a invocar — una guarda de ese tipo
 * deja el segundo montaje sin arrancar nunca el requestAnimationFrame
 * (la guarda ya estaba en `true` por el primer montaje, que la
 * limpieza ya había cancelado), y el número se queda pegado en 0. La
 * función de limpieza de abajo ya se encarga de cancelar el frame
 * viejo correctamente sin necesidad de esa guarda.
 */
export function CountUp({
  value,
  duration = 1200,
  formatter = (n: number) => String(n),
}: {
  value: number;
  duration?: number;
  formatter?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const inicio = performance.now();
    let frame: number;

    function tick(ahora: number) {
      const progreso = Math.min((ahora - inicio) / duration, 1);
      const facilitado = 1 - Math.pow(1 - progreso, 3);
      setDisplay(Math.round(facilitado * value));
      if (progreso < 1) frame = requestAnimationFrame(tick);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplay(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{formatter(display)}</>;
}
