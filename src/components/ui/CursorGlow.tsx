"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * Resplandor suave que sigue al cursor dentro de su contenedor padre.
 * Es un efecto puramente decorativo con opacidad propia que solo sube
 * al pasar el mouse — no gatea ningún contenido, y en mobile (sin mouse)
 * simplemente nunca se activa.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const quickX = useRef<((value: number) => void) | null>(null);
  const quickY = useRef<((value: number) => void) | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const padre = el?.parentElement;
      if (!el || !padre) return;

      quickX.current = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      quickY.current = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

      function onMove(e: MouseEvent) {
        const rect = padre!.getBoundingClientRect();
        quickX.current?.(e.clientX - rect.left);
        quickY.current?.(e.clientY - rect.top);
        gsap.to(el, { opacity: 1, duration: 0.3 });
      }
      function onLeave() {
        gsap.to(el, { opacity: 0, duration: 0.4 });
      }

      padre.addEventListener("mousemove", onMove);
      padre.addEventListener("mouseleave", onLeave);
      return () => {
        padre.removeEventListener("mousemove", onMove);
        padre.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 -z-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
      style={{ background: "radial-gradient(circle, rgb(234 88 12 / 0.12), transparent 70%)" }}
    />
  );
}
