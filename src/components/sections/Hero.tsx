"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Foto } from "@/components/ui/Foto";
import { CountUp } from "@/components/ui/CountUp";
import { AHORRO, formatBs } from "@/lib/datos";
import { useIdioma } from "@/lib/preferencias";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const METRICAS = [
  { valor: 4, prefijo: "", sufijo: "", bs: false },
  { valor: AHORRO, prefijo: "", sufijo: "", bs: true },
  { valor: 6, prefijo: "", sufijo: "", bs: false },
  { valor: 0, prefijo: "", sufijo: "", bs: false, acento: true, gratis: true },
];
const LETRAS = "Entreobra".split("");

export function Hero() {
  const seccionRef = useRef<HTMLElement>(null);
  const fondoRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const textoRef = useRef<HTMLDivElement>(null);
  const reducido = usePrefersReducedMotion();
  const { idioma, t } = useIdioma();

  useGSAP(
    () => {
      const seccion = seccionRef.current;
      if (!seccion) return;
      const letras = gsap.utils.toArray<HTMLElement>("[data-letra]", seccion);
      const letrasBrillo = gsap.utils.toArray<HTMLElement>("[data-letra-brillo]", seccion);
      const brillo = seccion.querySelector<HTMLElement>("[data-brillo]");

      if (reducido) {
        gsap.set(letras, { opacity: 1 });
        return;
      }

      gsap.fromTo(
        letras,
        { opacity: 0, yPercent: 70, filter: "blur(14px)" },
        {
          opacity: 1,
          yPercent: 0,
          filter: "blur(0px)",
          duration: 1.6,
          ease: "expo.out",
          delay: 0.15,
          stagger: { each: 0.07, from: "center" },
          clearProps: "filter",
        },
      );
      if (brillo) gsap.to(brillo, { opacity: 1, duration: 1.2, delay: 1.6 });

      const scrollTrigger = {
        trigger: seccion,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      const centro = (LETRAS.length - 1) / 2;
      gsap.to(fondoRef.current, { yPercent: 18, ease: "none", scrollTrigger });
      gsap.to(wordmarkRef.current, { yPercent: 50, opacity: 0, ease: "none", scrollTrigger });
      gsap.to([...letras, ...letrasBrillo], {
        x: (i) => ((i % LETRAS.length) - centro) * 26,
        ease: "none",
        scrollTrigger,
      });
      gsap.to(textoRef.current, {
        y: -40,
        opacity: 0,
        ease: "none",
        scrollTrigger: { ...scrollTrigger, end: "70% top" },
      });
    },
    { scope: seccionRef, dependencies: [reducido], revertOnUpdate: true },
  );

  return (
    <section id="top" ref={seccionRef} data-zona="oscura" className="relative isolate overflow-hidden">
      <div ref={fondoRef} data-velo-claro className="absolute inset-x-0 top-[-6%] -z-10 h-[112%]">
        <Foto textura="encofrado" velo={0.28} />
        <div className="absolute inset-0 bg-linear-to-r from-carbon/70 via-carbon/20 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-carbon/40 via-transparent to-carbon/50" />
      </div>

      <div
        ref={wordmarkRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-12 -z-10 flex select-none justify-center md:top-[14%]"
      >
        <span className="relative block text-[11vw] font-light uppercase leading-none md:text-[8.5vw] xl:text-[120px]">
          <span className="block whitespace-nowrap pl-[0.28em] tracking-[0.28em] text-yeso/7">
            {LETRAS.map((letra, i) => (
              <span key={i} data-letra className="inline-block opacity-0">
                {letra}
              </span>
            ))}
          </span>
          <span data-brillo className="hero-brillo absolute inset-0 block whitespace-nowrap pl-[0.28em] tracking-[0.28em] text-yeso/30 opacity-0">
            {LETRAS.map((letra, i) => (
              <span key={i} data-letra-brillo className="inline-block">
                {letra}
              </span>
            ))}
          </span>
        </span>
      </div>

      <div className="contenedor flex min-h-[calc(100svh-4rem)] flex-col md:min-h-[min(calc(100svh-4rem),56rem)] lg:min-h-[min(calc(100svh-4.5rem),56rem)]">
        <div ref={textoRef} className="flex flex-1 flex-col justify-center pb-14 pt-32 md:pb-20 md:pt-40">
          <p className="etiqueta animate-aparecer flex items-center gap-4 text-arena/70" style={{ animationDelay: "250ms" }}>
            <span className="animate-trazo block h-px w-8 bg-oxido" style={{ animationDelay: "350ms" }} />
            <span>
              {t.hero.ubicacion}
              <span className="hidden sm:inline"> · </span>
              <span className="block sm:inline">{t.hero.proximamente}</span>
            </span>
          </p>

          <h1 className="titulo mt-6 text-[2.75rem] text-yeso sm:text-6xl lg:text-[4.5rem]">
            {t.hero.titulo.map((linea, i) => (
              <span key={i} className="mb-[-0.12em] block overflow-hidden pb-[0.12em]">
                <span className="animate-linea block" style={{ animationDelay: `${380 + i * 110}ms` }}>
                  {linea}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="animate-aparecer mt-7 max-w-md text-[15px] leading-relaxed text-arena/80 md:text-base"
            style={{ animationDelay: "650ms" }}
          >
            {t.hero.bajada}
          </p>

          <div className="animate-aparecer mt-10 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "780ms" }}>
            <a href="#acceso" className="boton boton-oxido">
              {t.hero.cta}
            </a>
            <a href="#proveedores" className="boton boton-linea">
              {t.hero.ctaProveedor}
            </a>
          </div>
        </div>

        <dl className="relative grid grid-cols-2 border-t border-yeso/8 bg-carbon/95 backdrop-blur-sm md:grid-cols-4">
          {METRICAS.map((m, i) => (
            <div
              key={i}
              className={cn(
                "animate-aparecer relative flex flex-col px-5 py-6 md:px-7 md:py-8",
                i % 2 === 1 && "border-l border-yeso/8",
                i >= 2 && "border-t border-yeso/8 md:border-t-0",
                i === 2 && "md:border-l",
              )}
              style={{ animationDelay: `${900 + i * 90}ms` }}
            >
              <dt className="etiqueta order-2 mt-3 text-[10px] leading-relaxed tracking-[0.18em] text-oliva md:tracking-[0.32em]">{t.hero.metricas[i]}</dt>
              <dd
                className={cn(
                  "-order-1 text-[1.65rem] font-light leading-none tabular-nums md:text-[2rem]",
                  m.acento ? "text-oxido" : "text-yeso",
                )}
              >
                {m.gratis ? (
                  t.hero.gratis
                ) : (
                  <>
                    {m.prefijo}
                    <CountUp
                      value={m.valor}
                      retraso={950 + i * 90}
                      desde={m.bs ? Math.round((m.valor * 0.6) / 10) * 10 : 0}
                      formatter={m.bs ? (n) => formatBs(n, idioma) : undefined}
                    />
                    {m.sufijo}
                  </>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
