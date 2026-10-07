"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Fondo = "carbon" | "yeso";

export function Monograma({
  className,
  fondo = "carbon",
  mono = false,
  grueso = false,
}: {
  className?: string;
  fondo?: Fondo;
  mono?: boolean;
  grueso?: boolean;
}) {
  const corchete = mono ? "currentColor" : "var(--color-oxido)";
  const letra = mono ? "currentColor" : fondo === "carbon" ? "var(--color-yeso)" : "var(--color-carbon)";
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn("monograma h-6 w-6 shrink-0 overflow-visible", className)}>
      <g stroke={corchete} strokeWidth={grueso ? 2.6 : 1.45} strokeLinecap="square" strokeLinejoin="miter">
        <path className="corchete-izq" d="M11 5H6.5v22H11" />
        <path className="corchete-der" d="M21 5h4.5v22H21" />
      </g>
      <g className="monograma-e" stroke={letra} strokeWidth={grueso ? 1.8 : 0.95} strokeLinecap="square">
        <path pathLength={1} d="M18.9 11h-5.6v10h5.6" />
        <path pathLength={1} d="M13.3 16h4.9" />
      </g>
    </svg>
  );
}

const NOMBRE = "Entreobra";
const BAJADA = "Materiales de obra";

type Variante = "principal" | "sin-bajada" | "icono" | "solo-icono";
type Animacion = "no" | "carga" | "scroll";

export function Logo({
  variante = "icono",
  tamano,
  fondo = "carbon",
  animado = "no",
  className,
}: {
  variante?: Variante;
  tamano?: number;
  fondo?: Fondo;
  animado?: Animacion;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(animado !== "scroll");

  useEffect(() => {
    if (animado !== "scroll" || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animado]);

  const estado = animado === "no" ? undefined : visible ? "si" : "espera";
  const colorNombre = fondo === "carbon" ? "text-yeso" : "text-carbon";
  const conIcono = variante === "icono" || variante === "solo-icono";

  return (
    <span
      ref={ref}
      role="img"
      aria-label={variante === "principal" ? `${NOMBRE}, ${BAJADA}` : NOMBRE}
      data-animar={estado}
      className={cn("logo inline-flex items-center", className)}
      style={tamano ? { fontSize: tamano } : undefined}
    >
      {conIcono && (
        <Monograma
          fondo={fondo}
          grueso={tamano !== undefined && tamano < 13}
          className={cn("h-[1.55em] w-[1.55em]", variante === "icono" && "mr-[0.6em]")}
        />
      )}
      {variante !== "solo-icono" && (
        <span className="inline-flex flex-col items-start" aria-hidden>
          <span className={cn("wordmark leading-none", colorNombre)}>
            {NOMBRE.split("").map((letra, i) => (
              <span key={i} className="logo-letra" style={{ "--i": i } as React.CSSProperties}>
                {letra}
              </span>
            ))}
          </span>
          {variante === "principal" && <span className="wordmark-bajada logo-bajada mt-[0.75em] leading-none text-oliva">{BAJADA}</span>}
        </span>
      )}
    </span>
  );
}
