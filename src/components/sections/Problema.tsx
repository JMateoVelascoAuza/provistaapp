"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useIdioma } from "@/lib/preferencias";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// Textos en t.problema.intercambios (mismo orden).
const INTERCAMBIOS: { horaPregunta: string; horaRespuesta: string; esVisto?: boolean }[] = [
  { horaPregunta: "08:02", horaRespuesta: "08:47" },
  { horaPregunta: "08:49", horaRespuesta: "09:31" },
  { horaPregunta: "09:35", horaRespuesta: "10:49", esVisto: true },
];

// Cada problema se enciende en un momento del chat: `momento` es el
// índice del mensaje (pregunta 0, respuesta 0, pregunta 1, ...).
// Textos en t.problema.dolores (mismo orden).
const DOLORES = [{ momento: 0 }, { momento: 1 }, { momento: 3 }, { momento: 5 }];

const CHATS = [
  { nombre: "Ferretería A", sinLeer: 0 },
  { nombre: "Ferretería B", sinLeer: 2 },
  { nombre: "Distribuidora C", sinLeer: 1 },
  { nombre: "Fletes D", sinLeer: 3 },
];

// 08:02 → 10:49: lo que lleva la obra esperando al final del chat.
const ESPERA_TOTAL = 167;

function formatoEspera(minutos: number) {
  const h = Math.floor(minutos / 60);
  const m = Math.round(minutos % 60);
  return h > 0 ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`;
}

function PuntosTipeo() {
  return (
    <span className="inline-flex items-center gap-1 rounded-2xl rounded-br-sm bg-oxido-claro px-3.5 py-2.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-oxido-oscuro/60"
          style={{ animationDelay: `${i * 140}ms`, animationDuration: "900ms" }}
        />
      ))}
    </span>
  );
}

/**
 * El chat es el problema en vivo; la lista de la izquierda es su
 * lectura. A medida que el chat avanza, cada problema se enciende en el
 * mensaje que lo provoca, y el contador de espera corre con las horas
 * de los mensajes hasta el "Visto" sin respuesta.
 */
export function Problema() {
  const ref = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const reducido = usePrefersReducedMotion();
  const { t } = useIdioma();

  useGSAP(
    () => {
      const el = ref.current;
      const chat = chatRef.current;
      if (!el || !chat) return;
      const preguntas = el.querySelectorAll<HTMLElement>("[data-pregunta]");
      const tipeos = el.querySelectorAll<HTMLElement>("[data-tipeo]");
      const respuestas = el.querySelectorAll<HTMLElement>("[data-respuesta]");
      const dolores = el.querySelectorAll<HTMLElement>("[data-dolor]");
      const barras = el.querySelectorAll<HTMLElement>("[data-barra]");
      const numeros = el.querySelectorAll<HTMLElement>("[data-numero]");
      const contador = el.querySelector<HTMLElement>("[data-espera]");
      const cierre = el.querySelector<HTMLElement>("[data-cierre]");

      // Siempre se anima, aunque la página cargue con el chat ya en
      // pantalla (recarga a mitad de página): ScrollTrigger lo dispara al
      // instante en ese caso.
      if (reducido) return;

      gsap.set(preguntas, { opacity: 0, y: 10 });
      gsap.set(tipeos, { opacity: 0, y: 6, scale: 0.9 });
      gsap.set(respuestas, { opacity: 0, y: 6, scale: 0.95 });
      gsap.set(dolores, { opacity: 0.35 });
      gsap.set(barras, { scaleY: 0 });
      // El color final sale del CSS del tema activo (en el claro el óxido
      // de texto es más oscuro, para que se lea).
      const acento = numeros[0] ? getComputedStyle(numeros[0]).color : "#c2410c";
      gsap.set(numeros, { color: "#696c63" });
      if (cierre) gsap.set(cierre, { opacity: 0, y: 8 });
      const espera = { minutos: 0 };
      if (contador) contador.textContent = formatoEspera(0);

      const tl = gsap.timeline({ scrollTrigger: { trigger: chat, start: "top 78%", once: true } });
      const momentos: number[] = [];

      INTERCAMBIOS.forEach((_, i) => {
        tl.to(preguntas[i], { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, i === 0 ? 0 : "+=0.1");
        momentos.push(tl.duration());
        tl.to(tipeos[i], { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "back.out(2)" }, "+=0.08");
        tl.to(tipeos[i], { opacity: 0, duration: 0.15 }, "+=0.35");
        tl.to(respuestas[i], { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.6)" }, "<");
        momentos.push(tl.duration());
      });
      if (cierre) tl.to(cierre, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, "+=0.15");

      DOLORES.forEach((dolor, i) => {
        const tiempo = momentos[dolor.momento] - 0.1;
        tl.to(dolores[i], { opacity: 1, duration: 0.35, ease: "power2.out" }, tiempo);
        tl.to(barras[i], { scaleY: 1, duration: 0.45, ease: "power3.out" }, tiempo);
        tl.to(numeros[i], { color: acento, duration: 0.3 }, tiempo);
      });

      if (contador) {
        tl.to(
          espera,
          {
            minutos: ESPERA_TOTAL,
            duration: momentos[momentos.length - 1],
            ease: "none",
            onUpdate: () => {
              contador.textContent = formatoEspera(espera.minutos);
            },
          },
          0,
        );
      }
    },
    { scope: ref, dependencies: [reducido], revertOnUpdate: true },
  );

  return (
    <section id="problema" className="bg-yeso py-24 text-tierra md:py-32">
      <div
        ref={ref}
        className="contenedor grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-12"
      >
        <ScrollReveal className="lg:col-start-1 lg:row-start-1">
          <p className="etiqueta text-oliva-oscuro">{t.problema.etiqueta}</p>
          <h2 className="titulo mt-5 text-[2rem] text-carbon md:text-[2.75rem]">
            {t.problema.titulo[0]}
            <br />
            {t.problema.titulo[1]}
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-tierra/75">
            {t.problema.bajada}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
          <div
            ref={chatRef}
            className="border border-arena/70 bg-white px-5 py-6 shadow-[0_30px_60px_-40px_rgb(36_34_32/0.35)] sm:px-8 sm:py-8"
          >
            <div className="flex items-baseline justify-between gap-4">
              <p className="etiqueta text-[10px] text-oliva-oscuro">{t.problema.chat}</p>
              <p className="text-[11px] text-oliva-oscuro">
                {t.problema.esperando} <span data-espera className="tabular-nums text-oxido">{formatoEspera(ESPERA_TOTAL)}</span>
              </p>
            </div>

            <div className="mt-4 flex gap-4 overflow-hidden border-b border-arena/70 text-[12px]">
              {CHATS.map((c, i) => (
                <span
                  key={c.nombre}
                  className={cn(
                    "-mb-px flex shrink-0 items-center gap-1.5 border-b pb-2.5",
                    i === 0 ? "border-oxido text-carbon" : "border-transparent text-oliva-oscuro",
                  )}
                >
                  {c.nombre}
                  {c.sinLeer > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center bg-arena/60 px-1 text-[10px] tabular-nums text-tierra">
                      {c.sinLeer}
                    </span>
                  )}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {INTERCAMBIOS.map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <p
                    data-pregunta
                    className="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-yeso-claro px-4 py-2.5 text-[14px] text-carbon shadow-sm"
                  >
                    {t.problema.intercambios[i].pregunta}
                    <span className="ml-2.5 text-[10px] tabular-nums text-oliva-oscuro">{item.horaPregunta}</span>
                  </p>

                  <div className="relative h-10 self-end">
                    <div data-tipeo className="absolute right-0 top-0 opacity-0">
                      <PuntosTipeo />
                    </div>
                    {item.esVisto ? (
                      <p
                        data-respuesta
                        className="absolute right-0 top-1.5 flex items-center gap-1.5 whitespace-nowrap px-1 text-xs text-oliva-oscuro"
                      >
                        {t.problema.intercambios[i].respuesta} {item.horaRespuesta}
                        <span className="flex items-center text-oxido">
                          <Check size={12} />
                          <Check size={12} className="-ml-1.5" />
                        </span>
                      </p>
                    ) : (
                      <p
                        data-respuesta
                        className="absolute right-0 top-0 whitespace-nowrap rounded-2xl rounded-br-sm bg-oxido-claro px-4 py-2.5 text-[14px] text-oxido-oscuro"
                      >
                        {t.problema.intercambios[i].respuesta}
                        <span className="ml-2.5 text-[10px] tabular-nums text-oxido-oscuro">{item.horaRespuesta}</span>
                      </p>
                    )}
                  </div>

                  {i < INTERCAMBIOS.length - 1 && <div className="h-1" />}
                </div>
              ))}
            </div>

            <p data-cierre className="mt-6 border-t border-arena pt-5 text-[13px] text-tierra/80">
              {t.problema.cierre[0]}
              <span className="text-oxido">{t.problema.cierre[1]}</span>
              {t.problema.cierre[2]}
            </p>
          </div>
        </ScrollReveal>

        <ol className="border-t border-arena lg:col-start-1 lg:row-start-2">
          {DOLORES.map((dolor, i) => (
            <li
              key={i}
              data-dolor
              className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 border-b border-arena py-5 pl-5"
            >
              <span data-barra aria-hidden className="absolute bottom-0 left-0 top-0 w-0.5 origin-top bg-oxido" />
              <span data-numero className="pt-1 text-[11px] tracking-[0.3em] text-oxido">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-[17px] text-carbon">{t.problema.dolores[i].titulo}</p>
                <p className="mt-1 text-sm leading-relaxed text-tierra/75">{t.problema.dolores[i].detalle}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
