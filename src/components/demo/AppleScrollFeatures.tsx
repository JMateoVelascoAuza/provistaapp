"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "./PhoneFrame";
import { MockCarrito, MockCatalogo, MockDashboard, MockFletes, MockSeguimiento } from "./MockScreens";
import { cn } from "@/lib/utils";

const PASOS = [
  {
    titulo: "Busca y compara",
    descripcion: "Un solo catálogo para todos los materiales, con precios de varias ferreterías lado a lado.",
    Screen: MockCatalogo,
  },
  {
    titulo: "Arma tu pedido",
    descripcion: "Todo en un carrito, aunque los productos vengan de proveedores distintos.",
    Screen: MockCarrito,
  },
  {
    titulo: "Síguelo en vivo",
    descripcion: "Del taller a la obra: sabes en qué paso está tu pedido en cada momento, sin preguntar.",
    Screen: MockSeguimiento,
  },
  {
    titulo: "Si tienes una ferretería",
    descripcion: "Publica tu catálogo y gestiona tus pedidos entrantes desde un panel propio.",
    Screen: MockDashboard,
  },
  {
    titulo: "Si haces fletes",
    descripcion: "Recibe fletes disponibles cerca tuyo y acéptalos con un toque.",
    Screen: MockFletes,
  },
] as const;

/**
 * Storytelling de scroll estilo Apple: una sección "alta" (N x 100vh)
 * envuelve un panel `sticky` que se queda fijo en pantalla mientras se
 * scrollea por dentro de ella; el progreso del scroll dentro de ese
 * tramo decide qué paso está activo. El contenido siempre está montado
 * (arranca en el paso 0 tanto en servidor como en cliente) — el scroll
 * solo decide CUÁL mostrar, nunca si se esconde todo por completo.
 */
export function AppleScrollFeatures() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) return;
      const progreso = Math.min(1, Math.max(0, -rect.top / total));
      const idx = Math.min(PASOS.length - 1, Math.floor(progreso * PASOS.length));
      setActivo(idx);
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
    <div ref={wrapperRef} style={{ height: `${PASOS.length * 100}vh` }} className="relative">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-4 px-4 sm:gap-6 sm:px-8 md:grid-cols-2 md:items-center md:gap-10">
          <div className="order-2 flex flex-col gap-2 md:order-1 md:gap-5">
            {PASOS.map((paso, i) => (
              <button
                key={paso.titulo}
                onClick={() => {
                  const el = wrapperRef.current;
                  if (!el) return;
                  const total = el.offsetHeight - window.innerHeight;
                  window.scrollTo({ top: el.offsetTop + (total * i) / PASOS.length + 20, behavior: "smooth" });
                }}
                className={cn(
                  "flex flex-col items-start rounded-2xl border p-2.5 text-left transition-all duration-500 sm:p-4",
                  activo === i
                    ? "border-naranja-200 bg-naranja-50/60 opacity-100"
                    : "border-transparent opacity-40 hover:opacity-70",
                )}
              >
                <span className="flex items-center gap-2 text-xs font-bold text-marino-900 sm:text-sm">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold transition-colors sm:h-6 sm:w-6 sm:text-xs",
                      activo === i ? "bg-naranja-600 text-white" : "bg-marino-100 text-marino-500",
                    )}
                  >
                    {i + 1}
                  </span>
                  {paso.titulo}
                </span>
                <span
                  className={cn(
                    "mt-1 pl-7 text-xs text-marino-500 transition-all duration-300 sm:mt-1.5 sm:pl-8 sm:text-sm",
                    activo === i ? "max-h-20 opacity-100" : "max-h-0 overflow-hidden opacity-0",
                  )}
                >
                  {paso.descripcion}
                </span>
              </button>
            ))}
          </div>

          <div className="relative order-1 h-[320px] sm:h-[440px] md:order-2 md:h-[560px]">
            {PASOS.map(({ Screen }, i) => (
              <div
                key={i}
                className={cn(
                  "absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out",
                  activo === i ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                )}
              >
                <PhoneFrame>
                  <Screen />
                </PhoneFrame>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
