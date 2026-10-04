"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollReveal, ScrollStagger } from "@/components/ui/ScrollReveal";
import { AHORRO, formatBs, PROVEEDORES } from "@/lib/datos";
import { useIdioma } from "@/lib/preferencias";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, Flip);

// Orden en que aparecen las filas antes de que el comparador las ordene
// por precio (PROVEEDORES ya viene ordenado de menor a mayor).
const ORDEN_INICIAL = [1, 2, 0];

const precios = PROVEEDORES.map((p) => p.precio);
const MIN = Math.min(...precios);
const MAX = Math.max(...precios);
const anchoBarra = (precio: number) => 0.35 + (0.65 * (precio - MIN)) / (MAX - MIN || 1);

/**
 * La tarjeta "compara" al entrar en pantalla: las filas llegan
 * desordenadas, los precios cuentan hasta su valor, el comparador las
 * ordena (Flip: cada fila se desliza a su lugar), marca la mejor opción
 * y el ahorro cuenta hasta su total. El HTML del servidor ya es el
 * estado final, así que sin JS o con movimiento reducido se ve completo.
 */
export function Comparador() {
  const tarjetaRef = useRef<HTMLDivElement>(null);
  const reducido = usePrefersReducedMotion();
  const { idioma, t } = useIdioma();
  // La animación escribe textos y precios cuando corre: lee el idioma
  // vigente en ese momento, no el del primer render.
  const actual = useRef({ idioma, t });
  useEffect(() => {
    actual.current = { idioma, t };
  }, [idioma, t]);
  const nProveedores = t.comparador.numeros[PROVEEDORES.length - 1];

  useGSAP(
    () => {
      const tarjeta = tarjetaRef.current;
      if (reducido || !tarjeta) return;
      const filas = Array.from(tarjeta.querySelectorAll<HTMLElement>("[data-fila]"));
      const montos = Array.from(tarjeta.querySelectorAll<HTMLElement>("[data-monto]"));
      const barras = Array.from(tarjeta.querySelectorAll<HTMLElement>("[data-barra]"));
      const marca = tarjeta.querySelector<HTMLElement>("[data-marca]");
      const chip = tarjeta.querySelector<HTMLElement>("[data-chip]");
      const escaneo = tarjeta.querySelector<HTMLElement>("[data-escaneo]");
      const estado = tarjeta.querySelector<HTMLElement>("[data-estado]");
      const ahorro = tarjeta.querySelector<HTMLElement>("[data-ahorro]");

      if (!marca || !chip || !escaneo) return;
      // Textos que la animación reescribe: se restauran al deshacerla
      // (por ejemplo, si el usuario pide reducir movimiento).
      const originales = [estado, ahorro, ...montos].map((el) => [el, el?.textContent ?? ""] as const);
      filas.forEach((fila, i) => (fila.style.order = String(ORDEN_INICIAL[i])));
      gsap.set(filas, { opacity: 0, y: 14 });
      gsap.set(barras, { scaleX: 0 });
      gsap.set(barras[0], { backgroundColor: "#c4bdb2" });
      gsap.set([marca, chip], { opacity: 0 });
      gsap.set(marca, { scaleY: 0 });
      gsap.set(escaneo, { scaleX: 0 });
      const tc = actual.current.t.comparador;
      if (estado) estado.textContent = tc.comparando(tc.numeros[PROVEEDORES.length - 1]);
      montos.forEach((m) => (m.textContent = formatBs(0, actual.current.idioma)));
      if (ahorro) ahorro.textContent = formatBs(0, actual.current.idioma);

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: tarjeta, start: "top 75%", once: true },
      });

      tl.to(filas, { opacity: 1, y: 0, duration: 0.45, stagger: 0.09 }, 0);
      tl.to(escaneo, { scaleX: 1, duration: 1.3, ease: "power1.inOut" }, 0.1);
      montos.forEach((m, i) => {
        const valor = { n: 0 };
        tl.to(
          valor,
          {
            n: PROVEEDORES[i].precio,
            duration: 1.05,
            ease: "power2.out",
            onUpdate: () => {
              m.textContent = formatBs(Math.round(valor.n / 10) * 10, actual.current.idioma);
            },
          },
          0.2 + ORDEN_INICIAL[i] * 0.09,
        );
      });
      tl.to(barras, { scaleX: (i) => anchoBarra(PROVEEDORES[i].precio), duration: 1.05, stagger: 0.09 }, 0.2);

      tl.call(
        () => {
          if (estado) estado.textContent = actual.current.t.comparador.estadoFinal;
          const antes = Flip.getState(filas);
          filas.forEach((fila) => (fila.style.order = ""));
          Flip.from(antes, { duration: 0.75, ease: "power3.inOut" });
        },
        [],
        1.5,
      );

      tl.to(marca, { opacity: 1, scaleY: 1, duration: 0.45 }, 2.2);
      tl.to(chip, { opacity: 1, duration: 0.35 }, 2.25);
      tl.to(barras[0], { backgroundColor: "#c2410c", duration: 0.35 }, 2.2);
      if (ahorro) {
        const valor = { n: 0 };
        tl.to(
          valor,
          {
            n: AHORRO,
            duration: 0.8,
            ease: "power2.out",
            onUpdate: () => {
              ahorro.textContent = formatBs(Math.round(valor.n), actual.current.idioma);
            },
          },
          2.25,
        );
      }

      return () => {
        filas.forEach((fila) => (fila.style.order = ""));
        originales.forEach(([el, texto]) => {
          if (el) el.textContent = texto;
        });
      };
    },
    { scope: tarjetaRef, dependencies: [reducido], revertOnUpdate: true },
  );

  return (
    <section id="comparar" className="bg-yeso py-24 text-tierra md:py-32">
      <div className="contenedor grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-20">
        <ScrollReveal>
          <p className="etiqueta text-oliva-oscuro">{t.comparador.etiqueta}</p>
          <h2 className="titulo mt-5 text-[2rem] text-carbon md:text-[2.75rem]">
            {t.comparador.titulo[0]}
            <br />
            {t.comparador.titulo[1]}
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-tierra/75">{t.comparador.bajada}</p>

          <ScrollStagger
            itemSelector="li"
            stagger={0.1}
            from="left"
            distance={10}
            className="mt-10 max-w-md border-t border-arena pt-8"
          >
            <ul>
              {t.comparador.ventajas.map((ventaja, i) => (
                <li key={i} className="flex items-center gap-4 py-1.5 text-sm text-carbon">
                  <span className="h-px w-3 shrink-0 bg-oxido" />
                  {ventaja}
                </li>
              ))}
            </ul>
          </ScrollStagger>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div
            ref={tarjetaRef}
            className="border border-arena/70 bg-white px-5 py-7 shadow-[0_30px_60px_-40px_rgb(36_34_32/0.35)] sm:px-8 sm:py-9"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="etiqueta text-[10px] text-oliva-oscuro">{t.comparador.producto}</p>
              <p className="etiqueta hidden text-[10px] text-oliva-oscuro sm:block">{t.comparador.total}</p>
            </div>

            <div className="mt-4">
              <p data-estado className="text-[11px] text-oliva-oscuro">
                {t.comparador.estadoFinal}
              </p>
              <div className="mt-2 h-px bg-arena/50">
                <div data-escaneo className="h-full origin-left bg-oxido/70" />
              </div>
            </div>

            <div className="mt-2 flex flex-col">
              {PROVEEDORES.map((proveedor, i) => (
                <div
                  key={proveedor.nombre}
                  data-fila
                  className="relative border-b border-arena/50 bg-white py-5 pl-5"
                >
                  {i === 0 && (
                    <span data-marca className="absolute inset-y-3 left-0 w-0.5 origin-top bg-oxido" />
                  )}
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[15px]",
                          proveedor.sinConfirmar ? "text-oliva-oscuro" : "text-carbon",
                        )}
                      >
                        {proveedor.nombre}
                        {i === 0 && (
                          <span data-chip className="etiqueta text-[9px] tracking-[0.2em] text-oxido">
                            {t.comparador.mejorPrecio}
                          </span>
                        )}
                      </p>
                      <p
                        className={cn(
                          "mt-1.5 text-xs tabular-nums",
                          proveedor.sinConfirmar ? "text-oliva" : "text-oliva-oscuro",
                        )}
                      >
                        {proveedor.entrega} · {proveedor.distancia} · {t.comparador.stock[i]}
                      </p>
                    </div>
                    <p
                      data-monto
                      className={cn(
                        "shrink-0 text-[15px] tabular-nums",
                        i === 0 ? "text-carbon" : proveedor.sinConfirmar ? "text-oliva" : "text-tierra",
                      )}
                    >
                      {formatBs(proveedor.precio, idioma)}
                    </p>
                  </div>
                  <div className="mt-3 h-0.5 w-full bg-yeso">
                    <div
                      data-barra
                      className={cn("h-full origin-left", i === 0 ? "bg-oxido" : "bg-arena")}
                      style={{ transform: `scaleX(${anchoBarra(proveedor.precio)})` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="pt-6 text-[13px] text-tierra/80">
              {t.comparador.ahorras[0]}
              <span data-ahorro className="tabular-nums text-oxido">{formatBs(AHORRO, idioma)}</span>
              {t.comparador.ahorras[1]}
              {nProveedores}
              {t.comparador.ahorras[2]}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
