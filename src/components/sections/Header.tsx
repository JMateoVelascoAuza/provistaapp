"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Enlace } from "@/components/ui/Enlace";
import { cn } from "@/lib/utils";

// Las anclas van con "/#..." (no solo "#...") porque el Header también
// vive en /demo — así funcionan desde cualquier página. "Demo" es la
// excepción: no es un ancla de "/", es otra página — por eso tiene su
// propio `href` explícito en vez del patrón `/#${id}` del resto, y
// `destacado` para distinguirla visualmente (está fuera del alcance
// contratado, pensada para pulsear interés del cliente).
const NAV: { id: string; label: string; href?: string; destacado?: boolean }[] = [
  { id: "comparar", label: "Comparar" },
  { id: "como-funciona", label: "Cómo funciona" },
  { id: "proveedores", label: "Proveedores" },
  { id: "demo", label: "Demo", href: "/demo", destacado: true },
];

// Todas las secciones de "/" en orden, para que al pasar por una que no
// está en el menú (hero, materiales, acceso) se apague el subrayado.
const SECCIONES_OBSERVADAS = ["top", "materiales", "problema", "como-funciona", "comparar", "proveedores", "acceso"];

export function Header() {
  const pathname = usePathname();
  const [conScroll, setConScroll] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [activo, setActivo] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setConScroll(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Resalta en el menú la sección que está a mitad de pantalla. Solo
  // decide qué item subrayar, nunca si algo se ve.
  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActivo(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECCIONES_OBSERVADAS.map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-[background-color,border-color] duration-500",
          conScroll || menuAbierto ? "border-yeso/8 bg-carbon/92 backdrop-blur-md" : "border-yeso/6 bg-carbon",
        )}
      >
        <div className="contenedor flex h-16 items-center justify-between lg:h-18">
          <Enlace href="/#top" aria-label="Entreobra, ir al inicio" onClick={() => setMenuAbierto(false)}>
            <Logo variante="icono" animado="carga" className="text-[13px] lg:text-[15px]" />
          </Enlace>

          <nav aria-label="Principal" className="hidden items-center gap-10 lg:flex">
            {NAV.map((item) =>
              item.destacado ? (
                <Enlace
                  key={item.id}
                  href={item.href ?? `/#${item.id}`}
                  className="py-2 text-[11px] uppercase tracking-[0.24em] text-oxido transition-colors duration-300 hover:text-oxido-oscuro"
                >
                  {item.label}
                </Enlace>
              ) : (
                <Enlace
                  key={item.id}
                  href={item.href ?? `/#${item.id}`}
                  className={cn(
                    "group relative py-2 text-[11px] uppercase tracking-[0.24em] transition-colors duration-300",
                    activo === item.id ? "text-yeso" : "text-arena/80 hover:text-yeso",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-0 -bottom-px h-px origin-left bg-oxido transition-transform duration-500 ease-obra",
                      activo === item.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Enlace>
              ),
            )}
            <Enlace href="/#acceso" className="boton boton-linea min-h-10 px-5">
              Contacto
            </Enlace>
          </nav>

          <button
            type="button"
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            className="relative -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <span
              className={cn(
                "absolute h-px w-6 bg-yeso transition-transform duration-500 ease-obra",
                menuAbierto ? "rotate-45" : "-translate-y-1",
              )}
            />
            <span
              className={cn(
                "absolute h-px w-6 bg-yeso transition-transform duration-500 ease-obra",
                menuAbierto ? "-rotate-45" : "translate-y-1",
              )}
            />
          </button>
        </div>
      </header>

      {/* Menú móvil: pantalla completa, mismo lenguaje que el resto. Va
          fuera del <header> a propósito: el backdrop-blur del header
          convierte al header en el contenedor de cualquier hijo
          `fixed`, y el overlay quedaba recortado y transparente. */}
      <div
        id="menu-movil"
        className={cn(
          "fixed inset-x-0 bottom-0 top-16 z-40 bg-carbon transition-[opacity,visibility] duration-500 lg:hidden",
          menuAbierto ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav aria-label="Principal" className="contenedor flex h-full flex-col pb-10 pt-6">
          {[...NAV, { id: "acceso", label: "Contacto" }].map((item, i) => (
            <Enlace
              key={item.id}
              href={item.href ?? `/#${item.id}`}
              onClick={() => setMenuAbierto(false)}
              style={{ transitionDelay: menuAbierto ? `${80 + i * 60}ms` : "0ms" }}
              className={cn(
                "flex items-baseline gap-5 border-b border-yeso/8 py-5 transition-[opacity,transform] duration-700 ease-obra",
                menuAbierto ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
              )}
            >
              <span className="text-[11px] tracking-[0.2em] text-oliva">{String(i + 1).padStart(2, "0")}</span>
              <span className={cn("text-2xl font-light", item.destacado ? "text-oxido" : "text-yeso")}>
                {item.label}
              </span>
            </Enlace>
          ))}
          <div className="mt-auto">
            <Enlace href="/#comparar" onClick={() => setMenuAbierto(false)} className="boton boton-oxido w-full">
              Comparar precios
            </Enlace>
            <p className="etiqueta mt-6 text-center text-oliva">Cochabamba · Bolivia</p>
          </div>
        </nav>
      </div>
    </>
  );
}
