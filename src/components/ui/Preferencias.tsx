"use client";

import { Fragment } from "react";
import { Moon, Sun } from "lucide-react";
import { type Idioma, useIdioma, useTema } from "@/lib/preferencias";
import { cn } from "@/lib/utils";

const IDIOMAS: Idioma[] = ["es", "en"];

/** Selector de idioma (ES / EN) y de tema (claro / oscuro). */
export function SelectorPreferencias({ className }: { className?: string }) {
  const { idioma, setIdioma, t } = useIdioma();
  const { tema, setTema } = useTema();
  const etiquetaTema = tema === "oscuro" ? t.preferencias.temaClaro : t.preferencias.temaOscuro;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div role="group" aria-label={t.preferencias.idioma} className="flex items-center text-[11px] tracking-[0.2em]">
        {IDIOMAS.map((opcion, i) => (
          <Fragment key={opcion}>
            {i > 0 && (
              <span aria-hidden className="mx-1.5 text-oliva/60">
                /
              </span>
            )}
            <button
              type="button"
              lang={opcion}
              aria-pressed={idioma === opcion}
              onClick={() => setIdioma(opcion)}
              className={cn(
                "py-2 uppercase transition-colors duration-300",
                idioma === opcion ? "text-yeso" : "text-oliva hover:text-arena",
              )}
            >
              {opcion}
            </button>
          </Fragment>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setTema(tema === "oscuro" ? "claro" : "oscuro")}
        aria-label={etiquetaTema}
        title={etiquetaTema}
        className="flex h-9 w-9 items-center justify-center border border-yeso/15 text-arena transition-colors duration-300 hover:border-oxido hover:text-yeso"
      >
        {tema === "oscuro" ? <Sun size={15} strokeWidth={1.5} /> : <Moon size={15} strokeWidth={1.5} />}
      </button>
    </div>
  );
}
