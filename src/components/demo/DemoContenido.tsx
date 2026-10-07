"use client";

import { AppleScrollFeatures } from "@/components/demo/AppleScrollFeatures";
import { Footer } from "@/components/sections/Footer";
import { Enlace } from "@/components/ui/Enlace";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useIdioma } from "@/lib/preferencias";

export function DemoContenido() {
  const { t } = useIdioma();
  const d = t.demo;

  return (
    <>
      <main id="contenido">
        <section data-pagina="demo" data-zona="oscura" className="tex-plano relative overflow-hidden bg-carbon py-24 text-center md:py-28">
          <div className="relative mx-auto max-w-2xl px-5 sm:px-8">
            <p style={{ animationDelay: "0ms" }} className="animate-hero-in etiqueta text-oliva">
              {d.etiqueta}
            </p>
            <h1 style={{ animationDelay: "100ms" }} className="animate-hero-in titulo mt-5 text-[2.25rem] text-yeso sm:text-5xl">
              {d.titulo}
            </h1>
            <p style={{ animationDelay: "220ms" }} className="animate-hero-in mt-6 text-[15px] leading-relaxed text-arena/80 md:text-base">
              {d.bajada}
            </p>
          </div>
        </section>

        <AppleScrollFeatures />

        <section className="bg-yeso pt-20">
          <ScrollReveal className="contenedor" distance={16}>
            <div
              role="note"
              className="mx-auto max-w-3xl border border-oxido/30 border-l-2 border-l-oxido bg-oxido-claro px-6 py-7 sm:px-8"
            >
              <p className="etiqueta text-oxido-oscuro">{d.avisoEtiqueta}</p>
              <p className="titulo mt-3 text-xl text-carbon sm:text-2xl">{d.avisoTitulo}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-tierra/85">{d.avisoTexto}</p>
            </div>
          </ScrollReveal>
        </section>

        <section className="bg-yeso py-24">
          <ScrollReveal className="mx-auto flex max-w-2xl flex-col items-center px-5 text-center sm:px-8" distance={24}>
            <h2 className="titulo text-[2rem] text-carbon md:text-[2.5rem]">{d.ctaTitulo}</h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-tierra/75">{d.ctaTexto}</p>
            <Enlace href="/#acceso" className="boton boton-oxido mt-8">
              {d.ctaBoton}
            </Enlace>
            <Enlace
              href="/"
              className="mt-5 text-sm text-oliva-oscuro underline-offset-4 transition-colors duration-300 hover:text-carbon hover:underline"
            >
              {d.volver}
            </Enlace>
          </ScrollReveal>
        </section>
      </main>

      <Footer tono="oscuro" />
    </>
  );
}
