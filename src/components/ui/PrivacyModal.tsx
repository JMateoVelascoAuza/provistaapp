"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function PrivacyModal({ className }: { className?: string }) {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto]);

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className={cn("self-start transition-colors duration-300 sm:self-auto", className)}
      >
        Aviso de privacidad
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5" role="dialog" aria-modal="true" aria-labelledby="titulo-privacidad">
          <div className="animate-fade-up absolute inset-0 bg-carbon-950/80 backdrop-blur-sm" onClick={() => setAbierto(false)} />
          <div className="animate-fade-up relative w-full max-w-md bg-yeso p-8 text-left sm:p-10">
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center text-oliva-oscuro transition-colors hover:text-carbon"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
            <p className="etiqueta text-[10px] text-oliva-oscuro">Entreobra</p>
            <h3 id="titulo-privacidad" className="titulo mt-3 text-2xl text-carbon">
              Aviso de privacidad
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-tierra/85">
              Los datos que nos dejas (nombre y WhatsApp) los usamos únicamente para avisarte cuando Entreobra
              esté disponible en Cochabamba. No los compartimos ni vendemos a terceros. Si quieres que los
              eliminemos, escríbenos a{" "}
              <a href="mailto:hola@entreobra.com" className="text-carbon underline decoration-arena underline-offset-4 hover:decoration-oxido">
                hola@entreobra.com
              </a>{" "}
              y lo hacemos.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
