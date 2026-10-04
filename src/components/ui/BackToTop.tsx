"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useIdioma } from "@/lib/preferencias";
import { cn } from "@/lib/utils";

/**
 * No existe hasta que el usuario scrollea lo suficiente — arranca oculto
 * tanto en servidor como en cliente, así que no hay parpadeo posible.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { t } = useIdioma();

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 900);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      data-zona="oscura"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={t.volverArriba}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center border border-yeso/15 bg-carbon/90 text-arena backdrop-blur-sm transition-all duration-500 ease-obra md:bottom-8 md:right-8",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        "hover:border-oxido hover:text-yeso",
      )}
    >
      <ArrowUp size={16} strokeWidth={1.5} />
    </button>
  );
}
