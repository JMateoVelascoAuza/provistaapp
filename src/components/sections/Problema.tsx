import { Calculator, MessageCircleQuestion, Truck, HelpCircle } from "lucide-react";
import { ScrollStagger } from "@/components/ui/ScrollReveal";
import { ChatSimulado } from "./ChatSimulado";

const PROBLEMAS = [
  { Icon: MessageCircleQuestion, texto: "Cotizas uno por uno" },
  { Icon: Calculator, texto: "Comparas de memoria" },
  { Icon: Truck, texto: "Coordinas cada flete aparte" },
  { Icon: HelpCircle, texto: "Nadie sabe cuándo llega" },
];

export function Problema() {
  return (
    <section id="problema" className="bg-blueprint bg-gris-seccion py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-8">
        <div className="rounded-3xl border border-marino-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-10">
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-marino-900 sm:text-3xl">
              Hoy, pedir material se ve así
            </h2>
            <p className="mt-2 text-marino-500">Cuatro chats abiertos y ninguna respuesta clara.</p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-center">
            <ChatSimulado />

            <ScrollStagger className="flex flex-col gap-3" stagger={0.08} from="right">
              {PROBLEMAS.map((problema) => (
                <div
                  key={problema.texto}
                  className="flex items-center gap-3 rounded-xl border border-marino-100 bg-white px-4 py-3.5 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-naranja-50 text-naranja-600">
                    <problema.Icon size={16} />
                  </span>
                  <span className="text-sm font-medium text-marino-700">{problema.texto}</span>
                </div>
              ))}
            </ScrollStagger>
          </div>

          <p className="mt-10 text-center text-lg font-medium text-marino-900">
            Y mientras tanto, la obra espera.
          </p>
        </div>
      </div>
    </section>
  );
}
