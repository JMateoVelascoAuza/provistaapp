"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * El botón se corre un poco hacia el cursor cuando pasa cerca — puro
 * efecto de hover con GSAP quickTo, no decide visibilidad de nada.
 * Envuelve al elemento real (link o botón) sin cambiar su semántica.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.35,
}: {
  children: React.ReactElement<{ className?: string }>;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const quickX = useRef<((value: number) => void) | null>(null);
  const quickY = useRef<((value: number) => void) | null>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      quickX.current = gsap.quickTo(ref.current, "x", { duration: 0.4, ease: "power3.out" });
      quickY.current = gsap.quickTo(ref.current, "y", { duration: 0.4, ease: "power3.out" });
    },
    { scope: ref },
  );

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    quickX.current?.(relX * strength);
    quickY.current?.(relY * strength);
  }

  function onMouseLeave() {
    quickX.current?.(0);
    quickY.current?.(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className ?? "inline-block will-change-transform"}
    >
      {children}
    </div>
  );
}
