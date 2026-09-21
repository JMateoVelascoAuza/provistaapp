"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Building2, HardHat, Package, Truck, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const ICONOS = [
  { Icon: Package, className: "left-[4%] top-[14%]", size: 24 },
  { Icon: Wrench, className: "left-[92%] top-[10%]", size: 20 },
  { Icon: Truck, className: "left-[88%] top-[62%]", size: 28 },
  { Icon: HardHat, className: "left-[8%] top-[78%]", size: 22 },
  { Icon: Building2, className: "left-[48%] top-[4%]", size: 18 },
];

/**
 * Íconos decorativos siempre visibles desde el HTML — GSAP solo les
 * agrega el flotado continuo por encima, nunca decide si se ven o no.
 */
export function FloatingIcons({ dark = false }: { dark?: boolean }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(".floating-icon", {
        y: "-=18",
        duration: 2.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.4, from: "random" },
      });
    },
    { scope },
  );

  return (
    // Ocultos por debajo de `lg`: en una columna angosta (mobile/tablet)
    // no hay margen donde flotar sin taparse con el título o la tarjeta.
    <div ref={scope} className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
      {ICONOS.map(({ Icon, className, size }, i) => (
        <div
          key={i}
          className={cn(
            "floating-icon absolute rounded-2xl p-3 backdrop-blur-sm",
            dark ? "bg-white/10 text-white opacity-80" : "bg-white text-naranja-600 opacity-90 shadow-sm",
            className,
          )}
        >
          <Icon size={size} strokeWidth={1.75} />
        </div>
      ))}
    </div>
  );
}
