import { Check, HardHat, Store } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TiltCard } from "@/components/ui/TiltCard";

const COMPRADOR = [
  "Comparas proveedores sin salir de la obra",
  "Pides todo junto, aunque venga de varios lados",
  "Tus gastos quedan ordenados por proyecto",
];

const PROVEEDOR = [
  "Te encuentran obras que hoy no te conocen",
  "Recibes pedidos claros, sin cotizar por chat",
  "Sin comisión por venta: pagas una cuota fija",
];

export function ParaQuienEs() {
  return (
    <section id="para-quien-es" className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <ScrollReveal className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-marino-900 sm:text-3xl">
            Dos lados, una sola plataforma
          </h2>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 [perspective:1200px]">
          <ScrollReveal from="left">
            <TiltCard className="flex h-full flex-col rounded-2xl border border-marino-100 bg-white p-7 shadow-sm transition hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-marino-50 text-marino-900">
                <HardHat size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-marino-900">Si estás en obra</h3>
              <p className="text-sm text-marino-400">Residentes, ingenieros y contratistas</p>
              <ul className="mt-4 flex-1 space-y-2.5">
                {COMPRADOR.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-marino-600">
                    <Check size={16} className="mt-0.5 shrink-0 text-naranja-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-lg bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-700">
                Gratis para tu obra
              </div>
              <a
                href="#formulario"
                className="mt-4 rounded-full bg-naranja-600 py-3 text-center text-sm font-semibold text-white transition hover:bg-naranja-700"
              >
                Quiero probarlo
              </a>
            </TiltCard>
          </ScrollReveal>

          <ScrollReveal from="right" delay={0.1}>
            <TiltCard className="flex h-full flex-col rounded-2xl border border-marino-100 bg-white p-7 shadow-sm transition hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-marino-50 text-marino-900">
                <Store size={20} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-marino-900">Si vendes materiales</h3>
              <p className="text-sm text-marino-400">Ferreterías, distribuidores e importadores</p>
              <ul className="mt-4 flex-1 space-y-2.5">
                {PROVEEDOR.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-marino-600">
                    <Check size={16} className="mt-0.5 shrink-0 text-naranja-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-lg bg-naranja-50 px-3.5 py-2 text-sm text-naranja-800">
                Los primeros entran como <span className="font-semibold">fundadores</span>
              </div>
              <a
                href="#formulario"
                className="mt-4 rounded-full border border-marino-900 py-3 text-center text-sm font-semibold text-marino-900 transition hover:bg-marino-900 hover:text-white"
              >
                Quiero ser proveedor
              </a>
            </TiltCard>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
