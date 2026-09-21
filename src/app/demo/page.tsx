import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { AppleScrollFeatures } from "@/components/demo/AppleScrollFeatures";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Demo — Provista",
  description: "Una mirada por dentro a la app completa de Provista.",
};

export default function DemoPage() {
  return (
    <>
      <section className="bg-blueprint relative overflow-hidden bg-linear-to-b from-marino-900 to-marino-800 py-24 text-center text-white">
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-naranja-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-naranja-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-2xl px-4 sm:px-8">
          <span
            style={{ animationDelay: "0ms" }}
            className="animate-hero-in inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-naranja-300"
          >
            <Sparkles size={13} /> Vista previa de la app completa
          </span>
          <h1
            style={{ animationDelay: "100ms" }}
            className="animate-hero-in mt-5 text-3xl font-semibold tracking-tight sm:text-5xl"
          >
            Así se ve Provista por dentro
          </h1>
          <p style={{ animationDelay: "220ms" }} className="animate-hero-in mt-5 text-lg text-marino-200">
            Esto es un adelanto de la aplicación completa — más allá de la
            landing. Scrollea para ver los 5 momentos clave, del comprador al
            proveedor y al chofer.
          </p>
        </div>
      </section>

      <AppleScrollFeatures />

      <section className="bg-gris-seccion py-20">
        <ScrollReveal className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-4 text-center sm:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-marino-900 sm:text-3xl">
            ¿Te interesa llevar esto adelante?
          </h2>
          <p className="text-marino-500">
            Esta es una propuesta para conversar, todavía no forma parte del
            alcance contratado. Cuéntanos qué te pareció.
          </p>
          <Link
            href="/#formulario"
            className="group flex items-center gap-2 rounded-full bg-naranja-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:scale-105 hover:bg-naranja-700"
          >
            Hablemos de esto
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/" className="text-sm font-medium text-marino-500 underline-offset-2 hover:underline">
            Volver a la landing
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
