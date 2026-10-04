"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ExpoScaleEase } from "gsap/EasePack";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Foto } from "@/components/ui/Foto";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CATEGORIAS } from "@/lib/datos";
import { useIdioma } from "@/lib/preferencias";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, Flip, ExpoScaleEase);

const DESKTOP_MQ = "(min-width: 1024px)";
const MOBILE_MQ = "(max-width: 1023px)";

function yaVisible(el: HTMLElement) {
  return el.getBoundingClientRect().top < window.innerHeight * 0.9;
}

function PiezaCategoria({ categoria, numero }: { categoria: (typeof CATEGORIAS)[number]; numero: number }) {
  const { t } = useIdioma();
  const texto = t.materiales.categorias[numero - 1];
  return (
    <article data-zona="foto" className="group relative overflow-hidden bg-carbon-800">
      <Foto
        textura={categoria.textura}
        src={categoria.imagen}
        alt={categoria.imagen ? texto.nombre : ""}
        velo={0.12}
        imagenClassName="transition-transform duration-[1400ms] ease-obra group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-carbon/85 via-carbon/15 to-transparent" />
      <div className="absolute inset-0 ring-1 ring-yeso/6 ring-inset transition duration-500 group-hover:ring-yeso/15" />

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <p className="flex items-center gap-3 text-[10px] tracking-[0.3em] text-arena/70">
          {String(numero).padStart(2, "0")}
          <span className="h-px w-0 bg-oxido transition-all duration-700 ease-obra group-hover:w-6" />
        </p>
        <h3 className="mt-2 text-lg font-light tracking-[0.01em] text-yeso md:text-[1.375rem]">{texto.nombre}</h3>
        <p className="mt-1.5 hidden text-xs text-arena/65 sm:block">{texto.detalle}</p>
      </div>
    </article>
  );
}

/**
 * Pieza del centro: la que Flip lleva a pantalla completa. El texto usa
 * unidades `cqw` (relativas al ancho de la propia pieza), así crece
 * junto con ella durante el zoom en vez de quedar chico en el medio.
 */
function PiezaCentral() {
  const { t } = useIdioma();
  return (
    <article data-zona="foto" className="@container relative overflow-hidden bg-carbon-800 max-lg:col-span-2 max-lg:row-span-2">
      <Foto textura="deposito" velo={0.35} />
      <div className="absolute inset-0 bg-linear-to-t from-carbon/85 via-carbon/35 to-carbon/15" />
      <div className="absolute inset-0 ring-1 ring-yeso/6 ring-inset" />

      <div className="relative flex h-full flex-col items-center justify-center px-[7cqw] text-center">
        <p className="etiqueta text-[10px] text-arena/70">Entreobra</p>
        <p className="titulo mt-[2.5cqw] text-[clamp(1.375rem,6.5cqw,5.5rem)] text-yeso">
          {t.materiales.centroTitulo[0]}
          <br />
          {t.materiales.centroTitulo[1]}
        </p>
        <a data-centro-cta href="#comparar" className="boton boton-oxido mt-[4cqw]">
          {t.materiales.centroCta}
        </a>
      </div>
    </article>
  );
}

/**
 * Desktop: adaptación del "Scrubbed Bento Gallery" de GreenSock. La
 * grilla se fija en pantalla y, con el scroll, Flip la lleva de su
 * estado bento al de `.bento--final` (ver globals.css): la pieza
 * central se agranda hasta llenar el viewport y las seis categorías
 * salen por los bordes. `expoScale` hace que el zoom se sienta parejo
 * de punta a punta. Flip guarda medidas en píxeles, así que la
 * animación se rearma cuando cambia el tamaño de la ventana.
 *
 * Mobile: grilla de dos columnas sin pin, con una entrada escalonada.
 */
export function Materiales() {
  const seccionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const reducido = usePrefersReducedMotion();
  const { t } = useIdioma();
  const [medida, setMedida] = useState(0);

  useEffect(() => {
    let ancho = window.innerWidth;
    let alto = window.innerHeight;
    let espera: number | undefined;
    const alCambiar = () => {
      window.clearTimeout(espera);
      espera = window.setTimeout(() => {
        const cambioAncho = window.innerWidth !== ancho;
        // En mobile la barra del navegador cambia el alto al scrollear;
        // ahí solo importa el ancho.
        const cambioAlto = window.innerHeight !== alto && window.innerWidth >= 1024;
        ancho = window.innerWidth;
        alto = window.innerHeight;
        if (cambioAncho || cambioAlto) setMedida((m) => m + 1);
      }, 200);
    };
    window.addEventListener("resize", alCambiar);
    return () => {
      window.clearTimeout(espera);
      window.removeEventListener("resize", alCambiar);
    };
  }, []);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const grid = gridRef.current;
      if (reducido || !wrap || !grid) return;
      const piezas = Array.from(grid.children) as HTMLElement[];
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MQ, () => {
        const cta = grid.querySelector<HTMLElement>("[data-centro-cta]");

        grid.classList.add("bento--final");
        const estadoFinal = Flip.getState(piezas);
        grid.classList.remove("bento--final");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: "+=160%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.add(Flip.to(estadoFinal, { simple: true, duration: 1, ease: "expoScale(1, 5)" }), 0);
        if (cta) {
          gsap.set(cta, { autoAlpha: 0, y: 16 });
          tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0.8);
        }
        tl.to({}, { duration: 0.3 });

        // Este pin se arma después que los de las secciones de abajo (se
        // rehace al medir la ventana): sin reordenar, esas secciones
        // calculan su posición sin el espacio que agrega este pin y sus
        // animaciones se disparan antes de tiempo o se superponen.
        ScrollTrigger.sort();
        ScrollTrigger.refresh();

        return () => gsap.set([...piezas, ...(cta ? [cta] : [])], { clearProps: "all" });
      });

      mm.add(MOBILE_MQ, () => {
        const pendientes = piezas.filter((p) => !yaVisible(p));
        if (pendientes.length === 0) return;
        gsap.set(pendientes, { opacity: 0, y: 24 });
        ScrollTrigger.batch(pendientes, {
          start: "top 90%",
          once: true,
          onEnter: (lote) => gsap.to(lote, { opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: "power2.out" }),
        });
      });

      return () => mm.revert();
    },
    { scope: seccionRef, dependencies: [reducido, medida], revertOnUpdate: true },
  );

  return (
    <section id="materiales" ref={seccionRef} data-zona="oscura" className="bg-carbon pb-24 pt-24 md:pt-32 lg:pb-0">
      <div className="contenedor">
        <ScrollReveal className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="etiqueta text-oliva">{t.materiales.etiqueta}</p>
            <h2 className="titulo mt-5 text-[2rem] text-yeso md:text-[2.75rem]">
              {t.materiales.titulo[0]}
              <br />
              {t.materiales.titulo[1]}
            </h2>
          </div>
          <a href="#comparar" className="boton boton-linea self-start sm:self-auto">
            {t.materiales.verTodo}
          </a>
        </ScrollReveal>
      </div>

      <div
        ref={wrapRef}
        className="contenedor mt-12 md:mt-16 lg:mt-2 lg:flex lg:h-screen lg:max-w-none lg:items-center lg:justify-center lg:overflow-hidden lg:bg-carbon lg:px-0"
      >
        <div
          ref={gridRef}
          className="bento max-lg:grid max-lg:auto-rows-[188px] max-lg:grid-cols-2 max-lg:gap-2 sm:max-lg:auto-rows-[230px]"
        >
          {CATEGORIAS.slice(0, 2).map((categoria, i) => (
            <PiezaCategoria key={categoria.nombre} categoria={categoria} numero={i + 1} />
          ))}
          <PiezaCentral />
          {CATEGORIAS.slice(2).map((categoria, i) => (
            <PiezaCategoria key={categoria.nombre} categoria={categoria} numero={i + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
