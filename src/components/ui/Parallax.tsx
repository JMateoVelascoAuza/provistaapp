"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Desplaza el contenido a otra velocidad que el scroll normal mientras
 * su sección padre pasa por la pantalla. Es puro movimiento decorativo
 * ligado al scroll (vía `scrub`) — no esconde ni revela nada, así que
 * no aplica ninguna de las precauciones de FOUC de `ScrollReveal`.
 * Con `prefers-reduced-motion` no se aplica ningún desplazamiento.
 */
export function Parallax({
  children,
  speed = 0.3,
  className,
}: {
  children?: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducido = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!ref.current?.parentElement || reducido) return;
      gsap.to(ref.current, {
        y: window.innerHeight * speed,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: ref, dependencies: [reducido], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
