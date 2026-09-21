import { Check, X } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TiltCard } from "@/components/ui/TiltCard";

const CATALOGO_COMUN = ["Un precio por producto", "Un pedido por proveedor", "Sin registro por obra", "Sin seguimiento"];

const PROVISTA = [
  "Mismo material, varios proveedores lado a lado",
  "Un pedido, aunque venga de tres ferreterías",
  "Cada gasto ordenado por obra",
  "Sabes dónde está tu pedido",
];

export function Diferenciador() {
  return (
    <section id="diferenciador" className="bg-blueprint bg-gris-seccion py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <ScrollReveal className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-marino-900 sm:text-3xl">
            No es un catálogo. Es un comparador.
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-marino-500">
            Otras páginas te muestran productos. Provista te muestra cuál te conviene.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 [perspective:1200px]">
          <ScrollReveal from="left">
            <TiltCard className="rounded-2xl border border-marino-100 bg-white p-6 opacity-[0.82] shadow-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-marino-400">
                Un catálogo común
              </p>
              <ul className="space-y-3">
                {CATALOGO_COMUN.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-marino-500">
                    <X size={16} className="mt-0.5 shrink-0 text-marino-300" />
                    {item}
                  </li>
                ))}
              </ul>
            </TiltCard>
          </ScrollReveal>

          <ScrollReveal from="right" delay={0.1}>
            <TiltCard className="rounded-2xl bg-marino-900 p-6 text-white shadow-xl shadow-marino-900/20">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-marino-200">provista</p>
              <ul className="space-y-3">
                {PROVISTA.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-marino-50">
                    <Check size={16} className="mt-0.5 shrink-0 text-naranja-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </TiltCard>
          </ScrollReveal>
        </div>

        <p className="mt-10 text-center text-lg font-medium text-marino-900">
          Comparar es lo que te ahorra plata. Eso es lo que hacemos.
        </p>
      </div>
    </section>
  );
}
