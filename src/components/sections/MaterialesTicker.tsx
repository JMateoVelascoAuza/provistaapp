import { Boxes, Droplet, HardHat, Package, PaintBucket, Shield, Wrench, Zap } from "lucide-react";

const MATERIALES = [
  { Icon: Package, label: "Cemento y áridos" },
  { Icon: Boxes, label: "Fierro y estructuras" },
  { Icon: HardHat, label: "Ladrillos y bloques" },
  { Icon: Wrench, label: "Herramientas" },
  { Icon: Zap, label: "Electricidad" },
  { Icon: Droplet, label: "Plomería" },
  { Icon: PaintBucket, label: "Pintura y acabados" },
  { Icon: Shield, label: "Seguridad industrial" },
];

// Duplicado una vez para que el loop de la animación (translateX -50%)
// no se note el corte — es CSS puro, siempre animando, sin JS de por medio.
const DOBLE = [...MATERIALES, ...MATERIALES];

export function MaterialesTicker() {
  return (
    <div className="overflow-hidden border-y border-marino-100 bg-white py-5">
      <div className="marquee-track flex w-max gap-3">
        {DOBLE.map((item, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-2 rounded-full border border-marino-100 bg-gris-seccion px-4 py-2 text-sm font-medium text-marino-600"
          >
            <item.Icon size={15} className="text-naranja-600" />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
