import { Check, Star } from "lucide-react";
import { FloatingIcons } from "@/components/ui/FloatingIcons";
import { CountUp } from "@/components/ui/CountUp";
import { Parallax } from "@/components/ui/Parallax";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { MagneticButton } from "@/components/ui/MagneticButton";

// Nombres y precios de ejemplo — fáciles de reemplazar antes de publicar.
const PROVEEDORES = [
  { iniciales: "FSA", nombre: "Ferretería San Antonio", tiempo: "24h", distancia: "2.1 km", rating: 4.6, precio: 2600 },
  { iniciales: "MCB", nombre: "Materiales Cochabamba", tiempo: "48h", distancia: "3.8 km", rating: 4.4, precio: 2710 },
  { iniciales: "DBO", nombre: "Distribuidora Bolivia", tiempo: "72h", distancia: "6.4 km", rating: 4.1, precio: 2840 },
];

const ahorro = Math.max(...PROVEEDORES.map((p) => p.precio)) - Math.min(...PROVEEDORES.map((p) => p.precio));

function formatBs(valor: number) {
  return `Bs ${valor.toLocaleString("es-BO")}`;
}

export function Hero() {
  return (
    <section id="top" className="bg-blueprint relative overflow-hidden bg-linear-to-b from-gris-seccion to-white">
      <Parallax speed={-0.15} className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-naranja-200/30 blur-3xl" />
      <Parallax speed={0.2} className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-marino-200/40 blur-3xl" />
      <Parallax speed={-0.1} className="pointer-events-none absolute inset-0">
        <FloatingIcons />
      </Parallax>
      <CursorGlow />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-28">
        <div>
          <span
            style={{ animationDelay: "0ms" }}
            className="animate-hero-in inline-flex items-center gap-1.5 rounded-full bg-naranja-50 px-3.5 py-1.5 text-xs font-medium text-naranja-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-naranja-600" />
            Hecho en Cochabamba, para obras de Cochabamba
          </span>

          <h1
            style={{ animationDelay: "100ms" }}
            className="animate-hero-in mt-5 text-4xl font-semibold leading-tight tracking-tight text-marino-900 sm:text-5xl"
          >
            Todos los materiales de tu obra,
            <br />
            <span className="text-naranja-600">en un solo lugar</span>
          </h1>

          <p
            style={{ animationDelay: "200ms" }}
            className="animate-hero-in mt-5 max-w-lg text-lg text-marino-500"
          >
            Compara precios, tiempos de entrega y proveedores reales. Arma tu
            pedido en minutos, sin perder la mañana en WhatsApp.
          </p>

          <div style={{ animationDelay: "300ms" }} className="animate-hero-in mt-8 flex flex-wrap gap-3">
            <MagneticButton>
              <a
                href="#formulario"
                className="animate-pulse-slow inline-block rounded-full bg-naranja-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-naranja-700"
              >
                Quiero probarlo
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href="#para-quien-es"
                className="inline-block rounded-full border border-marino-900 px-6 py-3.5 text-sm font-semibold text-marino-900 transition hover:bg-marino-900 hover:text-white"
              >
                Soy proveedor
              </a>
            </MagneticButton>
          </div>

          <div
            style={{ animationDelay: "380ms" }}
            className="animate-hero-in mt-6 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-marino-500"
          >
            <span className="flex items-center gap-1.5">
              <Check size={15} className="text-naranja-600" /> Sin costo para tu obra
            </span>
            <span className="flex items-center gap-1.5">
              <Check size={15} className="text-naranja-600" /> Proveedores verificados
            </span>
          </div>
        </div>

        <div style={{ animationDelay: "180ms" }} className="animate-hero-in">
          <div className="rounded-2xl border border-marino-100 bg-white p-5 shadow-xl shadow-marino-900/10">
            <p className="text-xs text-marino-400">Buscaste</p>
            <p className="mb-4 font-semibold text-marino-900">Cemento IP-30 · 50 bolsas</p>

            <div className="flex flex-col gap-2.5">
              {PROVEEDORES.map((proveedor, i) => (
                <div
                  key={proveedor.nombre}
                  style={{ animationDelay: `${520 + i * 100}ms` }}
                  className="animate-fade-up flex items-center gap-3 rounded-xl border border-marino-100 p-3 transition hover:border-naranja-200 hover:bg-naranja-50/40"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-marino-500 text-[11px] font-semibold text-white">
                    {proveedor.iniciales}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-marino-900">{proveedor.nombre}</p>
                    <p className="flex items-center gap-1 text-xs text-marino-400">
                      {proveedor.tiempo} · {proveedor.distancia} ·{" "}
                      <Star size={11} className="fill-naranja-400 text-naranja-400" /> {proveedor.rating}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-marino-900">{formatBs(proveedor.precio)}</p>
                </div>
              ))}
            </div>

            <div
              style={{ animationDelay: "900ms" }}
              className="animate-fade-up mt-3 rounded-xl bg-naranja-50 px-3.5 py-2.5 text-sm text-naranja-800"
            >
              Ahorras{" "}
              <span className="font-semibold">
                Bs <CountUp value={ahorro} />
              </span>{" "}
              eligiendo el mejor precio de {PROVEEDORES.length} proveedores
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
