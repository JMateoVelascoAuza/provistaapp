"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * Inclinación 3D sutil que sigue al mouse. Es puramente interactivo
 * (mousemove/mouseleave) — no decide si el contenido se ve o no, así
 * que puede envolver contenido que ya viene mostrado por otro lado
 * (p.ej. dentro de un `ScrollReveal`) sin ningún riesgo de parpadeo.
 */
export function TiltCard({
  children,
  className,
  max = 6,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const quickX = useRef<((value: number) => void) | null>(null);
  const quickY = useRef<((value: number) => void) | null>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      quickX.current = gsap.quickTo(ref.current, "rotateY", { duration: 0.5, ease: "power3.out" });
      quickY.current = gsap.quickTo(ref.current, "rotateX", { duration: 0.5, ease: "power3.out" });
    },
    { scope: ref },
  );

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    quickX.current?.(px * max * 2);
    quickY.current?.(-py * max * 2);
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
      style={{ transformStyle: "preserve-3d" }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </div>
  );
}
