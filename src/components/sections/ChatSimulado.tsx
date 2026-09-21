"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const CHAT = [
  { texto: "Buenas, ¿a cuánto la bolsa de cemento?", tipo: "cliente" },
  { texto: "Déjeme consultar 👍", tipo: "proveedor" },
  { texto: "¿Y el flete hasta la obra?", tipo: "cliente" },
  { texto: "Eso es aparte", tipo: "proveedor" },
  { texto: "¿Ya salió el camión?", tipo: "cliente" },
  { texto: "Visto ✓✓", tipo: "visto" },
] as const;

function clasesBurbuja(tipo: (typeof CHAT)[number]["tipo"]) {
  if (tipo === "cliente") {
    return "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3.5 py-2 text-sm text-marino-700 shadow-sm";
  }
  if (tipo === "proveedor") {
    return "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-naranja-50 px-3.5 py-2 text-sm text-naranja-800";
  }
  return "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-marino-50 px-3.5 py-2 text-xs italic text-marino-400";
}

function PuntosEscribiendo() {
  return (
    <div className="ml-auto flex w-fit items-center gap-1 rounded-2xl rounded-br-sm bg-naranja-50 px-3.5 py-3">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          style={{ animationDelay: `${delay}ms` }}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-naranja-400"
        />
      ))}
    </div>
  );
}

/**
 * Secuencia de chat con indicador de "escribiendo..." antes de cada
 * respuesta del proveedor. Arranca en 0 elementos mostrados tanto en
 * servidor como en cliente (nada que ocultar después) y la secuencia
 * se dispara al entrar en pantalla — mismo patrón seguro que
 * `ScrollReveal`, solo que acá orquesta un timeline en vez de una sola
 * transición de opacidad.
 */
export function ChatSimulado() {
  const ref = useRef<HTMLDivElement>(null);
  const [visibles, setVisibles] = useState(0);
  const [escribiendo, setEscribiendo] = useState(false);
  const empezadoRef = useRef(false);

  useGSAP(
    () => {
      if (!ref.current) return;

      function empezar() {
        if (empezadoRef.current) return;
        empezadoRef.current = true;

        let i = 0;
        function siguiente() {
          if (i >= CHAT.length) return;
          const esRespuesta = CHAT[i].tipo === "proveedor";

          const revelar = () => {
            setVisibles(i + 1);
            i++;
            setTimeout(siguiente, 420);
          };

          if (esRespuesta) {
            setEscribiendo(true);
            setTimeout(() => {
              setEscribiendo(false);
              revelar();
            }, 700);
          } else {
            revelar();
          }
        }
        siguiente();
      }

      const rect = ref.current.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        empezar();
        return;
      }

      ScrollTrigger.create({ trigger: ref.current, start: "top 85%", once: true, onEnter: empezar });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="flex min-h-[240px] flex-col justify-end gap-2">
      {CHAT.slice(0, visibles).map((mensaje, i) => (
        <div key={i} className={cn("animate-fade-up", clasesBurbuja(mensaje.tipo))}>
          {mensaje.texto}
        </div>
      ))}
      {escribiendo && <PuntosEscribiendo />}
    </div>
  );
}
