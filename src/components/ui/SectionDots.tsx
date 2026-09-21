"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const SECCIONES = [
  { id: "top", label: "Inicio" },
  { id: "problema", label: "El problema" },
  { id: "como-funciona", label: "Cómo funciona" },
  { id: "diferenciador", label: "Diferenciador" },
  { id: "para-quien-es", label: "Para quién es" },
  { id: "formulario", label: "Contacto" },
];

/**
 * Puntos de navegación lateral que resaltan la sección activa. El
 * `IntersectionObserver` acá NO decide si algo se ve — solo cuál punto
 * pintar de naranja — así que no aplica el bug que ya encontramos con
 * `ScrollReveal` (ese sí gateaba visibilidad de contenido real).
 */
export function SectionDots() {
  const pathname = usePathname();
  const [activo, setActivo] = useState("top");

  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActivo(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    const elementos = SECCIONES.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <div className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-4 xl:flex">
      {SECCIONES.map((seccion) => (
        <a key={seccion.id} href={`/#${seccion.id}`} aria-label={seccion.label} className="group relative flex items-center justify-end py-0.5">
          <span className="absolute right-full mr-3 whitespace-nowrap rounded-md bg-marino-900 px-2 py-1 text-xs text-white opacity-0 shadow-sm transition group-hover:opacity-100">
            {seccion.label}
          </span>
          <span
            className={cn(
              "block rounded-full border-2 transition-all duration-300",
              activo === seccion.id ? "h-3 w-3 border-naranja-600 bg-naranja-600" : "h-2.5 w-2.5 border-marino-200 bg-white",
            )}
          />
        </a>
      ))}
    </div>
  );
}
