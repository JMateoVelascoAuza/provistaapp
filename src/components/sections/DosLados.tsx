"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Foto, type Textura } from "@/components/ui/Foto";
import { Logo } from "@/components/ui/Logo";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { elegirTipoUsuario, type TipoUsuario } from "@/lib/tipoUsuario";
import { useIdioma } from "@/lib/preferencias";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const LADOS: { tipo: TipoUsuario; textura: Textura }[] = [
  { tipo: "obra", textura: "malla" },
  { tipo: "proveedor", textura: "deposito" },
];

export function DosLados() {
  const ref = useRef<HTMLDivElement>(null);
  const reducido = usePrefersReducedMotion();
  const { t } = useIdioma();
  const [elegido, setElegido] = useState<TipoUsuario | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (reducido || !el) return;
      const tarjetas = el.querySelectorAll<HTMLElement>("[data-lado]");
      const contenido = el.querySelectorAll<HTMLElement>("[data-entra]");
      const lineas = el.querySelectorAll<HTMLElement>("[data-linea]");
      const palabras = el.querySelectorAll<HTMLElement>("[data-palabra]");

      gsap.set(tarjetas, { opacity: 0, x: (i) => (i === 0 ? -70 : 70) });
      gsap.set(contenido, { opacity: 0, y: 16 });
      gsap.set(lineas, { scaleY: 0 });
      gsap.set(palabras, { opacity: 0, yPercent: 30 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: el, start: "top 72%", once: true },
      });
      tl.to(lineas, { scaleY: 1, duration: 0.9, ease: "power2.inOut" }, 0);
      tl.to(tarjetas, { opacity: 1, x: 0, duration: 1 }, 0.15);
      tl.to(palabras, { opacity: 1, yPercent: 0, duration: 1.2 }, 0.35);
      tl.to(contenido, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.45);
    },
    { scope: ref, dependencies: [reducido], revertOnUpdate: true },
  );

  return (
    <section id="proveedores" data-zona="oscura" className="bg-carbon py-24 md:py-32">
      <div className="contenedor">
        <ScrollReveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="etiqueta text-oliva">{t.dosLados.etiqueta}</p>
            <h2 className="titulo mt-5 text-[2rem] text-yeso md:text-[2.75rem]">{t.dosLados.titulo}</h2>
          </div>
          <p className="max-w-xs text-[15px] leading-relaxed text-oliva sm:text-right">
            {t.dosLados.bajada}
          </p>
        </ScrollReveal>

        <div
          ref={ref}
          className="mt-12 flex flex-col md:mt-16 lg:flex-row lg:items-stretch"
          onMouseLeave={() => setElegido(null)}
        >
          {LADOS.map((lado, i) => (
            <div key={lado.tipo} className="contents">
              {i === 1 && (
                <div aria-hidden className="flex items-center justify-center py-6 lg:flex-col lg:px-6 lg:py-0">
                  <span data-linea className="h-px flex-1 origin-left bg-yeso/12 lg:h-auto lg:w-px lg:origin-top" />
                  <Logo variante="solo-icono" animado="scroll" className="mx-5 text-[34px] lg:mx-0 lg:my-6 lg:text-[46px]" />
                  <span data-linea className="h-px flex-1 origin-right bg-yeso/12 lg:h-auto lg:w-px lg:origin-bottom" />
                </div>
              )}

              <article
                data-lado
                data-zona="foto"
                onMouseEnter={() => setElegido(lado.tipo)}
                className={cn(
                  "@container group relative isolate flex overflow-hidden transition-[flex-grow,opacity] duration-700 ease-obra lg:min-h-[36rem] lg:basis-0",
                  elegido === null ? "lg:grow" : elegido === lado.tipo ? "lg:grow-[1.15]" : "lg:grow lg:opacity-55",
                )}
              >
                <Foto
                  textura={lado.textura}
                  velo={0.3}
                  className="-z-10"
                  imagenClassName="transition-transform duration-[1600ms] ease-obra group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 -z-10 bg-linear-to-t from-carbon via-carbon/40 to-carbon/10" />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-yeso/8 ring-inset transition duration-500 group-hover:ring-yeso/20" />

                <span
                  data-palabra
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-6 -z-10 flex select-none justify-center sm:bottom-8"
                >
                  <span className="wordmark whitespace-nowrap text-[9cqw] leading-none text-yeso/[0.07] transition-transform duration-[1600ms] ease-obra group-hover:-translate-y-1.5">
                    {t.dosLados.lados[i].palabra}
                  </span>
                </span>

                <div className="flex w-full flex-col px-6 pb-[calc(9cqw+4.5rem)] pt-10 sm:px-10 sm:pt-12 lg:px-12 lg:pt-14">
                  <p data-entra className="etiqueta flex items-center gap-3 text-[10px] text-arena/70">
                    <span className="h-px w-6 bg-oxido" />
                    {t.dosLados.lados[i].etiqueta}
                  </p>
                  <h3 data-entra className="titulo mt-5 text-[1.75rem] text-yeso md:text-[2.1rem]">
                    {t.dosLados.lados[i].titulo[0]}
                    <br />
                    {t.dosLados.lados[i].titulo[1]}
                  </h3>

                  <ol className="mt-9 flex-1 space-y-3 border-t border-yeso/10 pt-7">
                    {t.dosLados.lados[i].puntos.map((punto, k) => (
                      <li key={punto} data-entra className="flex gap-4 text-sm leading-relaxed text-arena/85">
                        <span className="pt-0.5 text-[10px] tracking-[0.3em] text-oxido">{String(k + 1).padStart(2, "0")}</span>
                        {punto}
                      </li>
                    ))}
                  </ol>

                  <a
                    data-entra
                    href="#acceso"
                    onClick={() => elegirTipoUsuario(lado.tipo)}
                    className={cn(
                      "boton mt-10 self-start",
                      lado.tipo === "obra" ? "boton-oxido" : "boton-linea",
                    )}
                  >
                    {t.dosLados.lados[i].cta}
                  </a>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
