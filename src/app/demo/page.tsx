import type { Metadata } from "next";
import { AppleScrollFeatures } from "@/components/demo/AppleScrollFeatures";
import { Footer } from "@/components/sections/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Enlace } from "@/components/ui/Enlace";

export const metadata: Metadata = {
  title: "Demo — Entreobra",
  description: "Una mirada por dentro a la app completa de Entreobra.",
};

export default function DemoPage() {
  return (
    <>
      <section className="tex-plano relative overflow-hidden bg-carbon py-24 text-center md:py-28">
        <div className="relative mx-auto max-w-2xl px-5 sm:px-8">
          <p style={{ animationDelay: "0ms" }} className="animate-hero-in etiqueta text-oliva">
            Vista previa · App completa
          </p>
          <h1 style={{ animationDelay: "100ms" }} className="animate-hero-in titulo mt-5 text-[2.25rem] text-yeso sm:text-5xl">
            Así se ve Entreobra por dentro.
          </h1>
          <p style={{ animationDelay: "220ms" }} className="animate-hero-in mt-6 text-[15px] leading-relaxed text-arena/80 md:text-base">
            Un adelanto de la aplicación, más allá de la landing. Seis momentos: del que compra, del que vende y del
            que transporta.
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
            <p className="etiqueta text-oxido-oscuro">Vista previa · En desarrollo</p>
            <p className="titulo mt-3 text-xl text-carbon sm:text-2xl">Esto no es el producto final.</p>
            <p className="mt-3 text-[15px] leading-relaxed text-tierra/85">
              Las pantallas muestran hacia dónde va Entreobra. La app está en desarrollo: el diseño, los datos, las
              empresas y los precios son de ejemplo, y pueden cambiar antes del lanzamiento.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-yeso py-24">
        <ScrollReveal className="mx-auto flex max-w-2xl flex-col items-center px-5 text-center sm:px-8" distance={24}>
          <h2 className="titulo text-[2rem] text-carbon md:text-[2.5rem]">¿Te interesa llevar esto adelante?</h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-tierra/75">
            Esta es una propuesta para conversar, todavía no forma parte del alcance contratado. Cuéntanos qué te
            pareció.
          </p>
          <Enlace href="/#acceso" className="boton boton-oxido mt-8">
            Hablemos de esto
          </Enlace>
          <Enlace
            href="/"
            className="mt-5 text-sm text-oliva-oscuro underline-offset-4 transition-colors duration-300 hover:text-carbon hover:underline"
          >
            Volver a la landing
          </Enlace>
        </ScrollReveal>
      </section>

      <Footer tono="oscuro" />
    </>
  );
}
