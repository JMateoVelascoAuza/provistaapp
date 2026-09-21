"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

// Las anclas van con "/#..." (no solo "#...") porque el Header también
// vive en /demo — así funcionan sin importar desde qué página se haga
// clic, en vez de solo scrollear si ya estás en "/".
const NAV = [
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/#para-quien-es", label: "Para proveedores" },
  { href: "/demo", label: "Demo", destacado: true },
];

export function Header() {
  const [conScroll, setConScroll] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    const onScroll = () => setConScroll(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-300",
        conScroll || menuAbierto
          ? "border-marino-100 bg-white/95 shadow-sm backdrop-blur-md"
          : "border-transparent bg-white/70 backdrop-blur-sm",
      )}
    >
      <div className="animate-fade-up mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
        <Link href="/#top">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-marino-500 md:flex">
          {NAV.map((item) =>
            item.destacado ? (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 text-naranja-600 transition-colors hover:text-naranja-700"
              >
                <Sparkles size={14} />
                {item.label}
              </Link>
            ) : (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-marino-900">
                {item.label}
              </Link>
            ),
          )}
          <Link
            href="/#formulario"
            className="rounded-full border border-marino-900 px-4 py-2 font-semibold text-marino-900 transition hover:bg-marino-900 hover:text-white"
          >
            Contacto
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
          className="flex h-10 w-10 items-center justify-center rounded-full text-marino-700 transition hover:bg-marino-100/60 md:hidden"
        >
          {menuAbierto ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-marino-100 bg-white transition-[max-height] duration-300 ease-in-out md:hidden",
          menuAbierto ? "max-h-72" : "max-h-0 border-t-0",
        )}
      >
        <nav className="flex flex-col px-4 py-2 sm:px-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuAbierto(false)}
              className={cn(
                "flex items-center gap-1.5 border-b border-marino-100 py-3 text-sm font-medium last:border-b-0",
                item.destacado ? "text-naranja-600" : "text-marino-600",
              )}
            >
              {item.destacado && <Sparkles size={14} />}
              {item.label}
            </Link>
          ))}
          <Link
            href="/#formulario"
            onClick={() => setMenuAbierto(false)}
            className="my-3 rounded-full bg-marino-900 px-4 py-2.5 text-center text-sm font-semibold text-white"
          >
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
}
