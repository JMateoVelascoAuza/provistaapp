"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal, ScrollStagger } from "@/components/ui/ScrollReveal";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const PASOS = [
  { titulo: "Registra tu obra", descripcion: "Tus pedidos y gastos quedan ordenados por proyecto." },
  { titulo: "Busca el material", descripcion: "Ves quién lo tiene en stock y a qué precio, al instante." },
  { titulo: "Arma tu pedido", descripcion: "Un solo pedido, aunque venga de varios proveedores." },
  { titulo: "Recibe en obra", descripcion: "Sabes cuándo sale y cuándo llega. Sin preguntar." },
];

function FilaMock({ nombre, valor, activo = false }: { nombre: string; valor: string; activo?: boolean }) {
  return (
    <div className="flex items-center justify-between border-t border-yeso/8 py-3 text-sm first:border-t-0">
      <span className={activo ? "text-yeso" : "text-arena/80"}>{nombre}</span>
      <span className={cn("tabular-nums", activo ? "font-normal text-oxido" : "text-oliva")}>{valor}</span>
    </div>
  );
}

function MockRegistrarObra() {
  return (
    <div>
      <p className="etiqueta text-[10px] text-oliva">Nueva obra</p>
      <div className="mt-4 space-y-2.5">
        <div className="border border-yeso/10 px-4 py-3 text-sm text-yeso">Edificio Torre del Bosque</div>
        <div className="border border-yeso/10 px-4 py-3 text-sm text-oliva">Cochabamba · Cercado</div>
      </div>
      <div className="boton boton-oxido mt-5 w-full">Crear obra</div>
    </div>
  );
}

function MockBuscarMaterial() {
  return (
    <div>
      <p className="etiqueta text-[10px] text-oliva">Cemento IP-30</p>
      <div className="mt-2">
        <FilaMock nombre="Ferretería San Antonio" valor="Bs 62" activo />
        <FilaMock nombre="Materiales Cochabamba" valor="Bs 68" />
        <FilaMock nombre="Distribuidora Bolivia" valor="Bs 71" />
      </div>
    </div>
  );
}

function MockArmarPedido() {
  return (
    <div>
      <p className="etiqueta text-[10px] text-oliva">Tu pedido</p>
      <div className="mt-2">
        <FilaMock nombre="Cemento IP-30 x5" valor="Bs 310" />
        <FilaMock nombre="Fierro 3/8 x10" valor="Bs 480" />
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-yeso/10 pt-4 text-sm">
        <span className="text-yeso">Total</span>
        <span className="font-normal text-oxido tabular-nums">Bs 790</span>
      </div>
    </div>
  );
}

function MockRecibirObra() {
  const pasos = ["Confirmado", "En preparación", "En camino", "Entregado"];
  return (
    <div>
      <p className="etiqueta text-[10px] text-oliva">Pedido #4821</p>
      <div className="mt-4 space-y-3">
        {pasos.map((p, i) => (
          <div key={p} className="flex items-center gap-3">
            <span className={cn("h-1.5 w-1.5 shrink-0", i <= 1 ? "bg-oxido" : "bg-yeso/15")} />
            <span className={cn("text-sm", i <= 1 ? "text-yeso" : "text-oliva")}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PANELES = [MockRegistrarObra, MockBuscarMaterial, MockArmarPedido, MockRecibirObra];
const DESKTOP_MQ = "(min-width: 1024px)";

/**
 * Desktop: el mismo mecanismo de `/demo` (`AppleScrollFeatures`) —
 * `ScrollTrigger` con `pin` + `scrub` real, la sección se "traba" en
 * pantalla mientras los cuatro pasos avanzan con el scroll, en vez de
 * solo pasar de largo con una línea de progreso pasiva. Mismo
 * contenido de siempre (títulos, descripciones, los cuatro mockups);
 * lo que cambia es la mecánica de scroll, no la información.
 *
 * Mobile: la lista simple apilada, sin pin — igual que en `/demo`, el
 * pin+scrub es una pieza de escritorio (sección 21 del master prompt
 * de la ronda anterior: mobile no es el mismo efecto reducido, es una
 * variante propia).
 */
export function ComoFunciona() {
  const seccionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lineaRef = useRef<HTMLDivElement>(null);
  const mockRefs = useRef<Array<HTMLDivElement | null>>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const [activo, setActivo] = useState(0);
  const reducido = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducido) return;
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MQ, () => {
        if (!panelRef.current) return;

        // Se fija el panel entero (título incluido): mientras avanzan los
        // pasos, el lector nunca pierde de vista qué está leyendo.
        const trigger = ScrollTrigger.create({
          trigger: panelRef.current,
          start: "top top",
          end: () => `+=${PASOS.length * window.innerHeight * 0.8}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const maxRaw = PASOS.length - 1;
            const raw = self.progress * maxRaw;
            const idx = Math.min(maxRaw, Math.max(0, Math.round(raw)));
            setActivo(idx);

            if (lineaRef.current) {
              gsap.set(lineaRef.current, { scaleX: 0.06 + (raw / maxRaw) * 0.94 });
            }

            const HOLD = 0.15;
            const RADIO = 0.65;
            mockRefs.current.forEach((el, i) => {
              if (!el) return;
              const distancia = raw - i;
              const offset = Math.abs(distancia);
              const t = Math.min(Math.max((offset - HOLD) / (RADIO - HOLD), 0), 1);
              const visibilidad = 1 - t;
              gsap.set(el, { opacity: visibilidad, y: distancia * 28, scale: 0.94 + 0.06 * visibilidad });
            });
          },
        });

        triggerRef.current = trigger;
        trigger.update();
        return () => {
          triggerRef.current = null;
          trigger.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: seccionRef, dependencies: [reducido] },
  );

  function irAlPaso(i: number) {
    const t = triggerRef.current;
    if (!t) return;
    const maxRaw = PASOS.length - 1;
    const destino = t.start + ((t.end - t.start) * i) / (maxRaw || 1);
    window.scrollTo({ top: destino, behavior: "smooth" });
  }

  return (
    <section id="como-funciona" ref={seccionRef} className="bg-carbon">
      {/* Desktop — panel fijo con título, pasos y pantalla */}
      <div ref={panelRef} className="hidden h-screen flex-col bg-carbon pt-[72px] lg:flex">
        <div className="contenedor flex w-full flex-1 flex-col justify-center py-10">
          <p className="etiqueta text-oliva">Cómo funciona</p>
          <h2 className="titulo mt-4 text-[2.75rem] text-yeso">Cuatro pasos, sin llamadas.</h2>

          <div className="relative mt-10">
            <div className="absolute inset-x-0 top-0 h-px bg-yeso/8" />
            <div
              ref={lineaRef}
              className="absolute inset-x-0 top-0 h-px origin-left bg-oxido"
              style={{ transform: "scaleX(0.06)" }}
            />

            <div className="grid grid-cols-2 items-center gap-16 pt-8">
              <div className="flex flex-col">
                {PASOS.map((paso, i) => (
                  <button
                    key={paso.titulo}
                    onClick={() => irAlPaso(i)}
                    className="group flex flex-col items-start border-t border-yeso/8 py-5 text-left first:border-t-0"
                  >
                    <span
                      className={cn(
                        "text-[11px] tracking-[0.3em] transition-colors duration-500",
                        i === activo ? "text-oxido" : "text-oliva group-hover:text-arena",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "mt-2.5 text-[1.35rem] font-light transition-colors duration-500",
                        i === activo ? "text-yeso" : "text-oliva",
                      )}
                    >
                      {paso.titulo}
                    </span>
                    <span
                      className={cn(
                        "mt-2 max-w-sm text-sm leading-relaxed text-oliva transition-all duration-500",
                        i === activo ? "max-h-20 opacity-100" : "max-h-0 overflow-hidden opacity-0",
                      )}
                    >
                      {paso.descripcion}
                    </span>
                  </button>
                ))}
              </div>

              <div className="relative h-[22rem]">
                {PANELES.map((Panel, i) => (
                  <div
                    key={i}
                    ref={(el) => {
                      mockRefs.current[i] = el;
                    }}
                    className={cn("absolute inset-0 flex items-center justify-center", i > 0 && "opacity-0")}
                  >
                    <div className="w-full max-w-[22rem] border border-yeso/10 bg-carbon-800 px-6 py-7">
                      <Panel />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile — título y lista simple, sin pin */}
      <div className="contenedor pb-24 pt-24 lg:hidden">
        <ScrollReveal>
          <p className="etiqueta text-oliva">Cómo funciona</p>
          <h2 className="titulo mt-5 text-[2rem] text-yeso md:text-[2.75rem]">Cuatro pasos, sin llamadas.</h2>
        </ScrollReveal>
        <ScrollStagger stagger={0.09} className="mt-10 flex flex-col">
          {PASOS.map((paso, i) => (
            <div key={paso.titulo} className="border-t border-yeso/8 py-7 first:border-t-0">
              <p className="text-[11px] tracking-[0.3em] text-oxido">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-[17px] font-normal text-yeso">{paso.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-oliva">{paso.descripcion}</p>
            </div>
          ))}
        </ScrollStagger>
      </div>
    </section>
  );
}
