"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, PlusSquare, Share2, X } from "lucide-react";
import { usePwaInstall } from "@/lib/usePwaInstall";

/**
 * Botón flotante + modal para instalar la PWA. Dos caminos reales,
 * bien distintos, por eso el modal se adapta:
 *
 * - Chrome/Edge/Android disparan `beforeinstallprompt` cuando ELLOS
 *   deciden que la app es instalable — ahí hay un botón nativo real
 *   ("Instalar Entreobra" → `instalar()`).
 * - Safari en iOS nunca dispara ese evento, así que ahí no hay
 *   instalación con un clic: se explican los pasos manuales (compartir
 *   → agregar a pantalla de inicio).
 *
 * En cualquier otro navegador (desktop sin soporte, ya instalada, etc.)
 * el botón no se muestra — no se promete algo que ese navegador no puede.
 */
const PASOS_IOS = [
  <>
    Toca el ícono de <span className="text-carbon">compartir</span>{" "}
    <Share2 size={13} strokeWidth={1.5} className="mb-0.5 inline" /> en la barra de Safari.
  </>,
  <>
    Desliza y elige{" "}
    <span className="text-carbon">
      Agregar a pantalla de inicio <PlusSquare size={13} strokeWidth={1.5} className="mb-0.5 inline" />
    </span>
    .
  </>,
  <>
    Toca <span className="text-carbon">Agregar</span> arriba a la derecha. Listo.
  </>,
];

export function InstalarPwa() {
  const { puedeInstalarNativo, instalada, esIOS, instalar } = usePwaInstall();
  const [abierto, setAbierto] = useState(false);

  if (instalada || (!puedeInstalarNativo && !esIOS)) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="fixed bottom-5 left-5 z-30 flex h-11 items-center gap-2.5 border border-yeso/15 bg-carbon/90 px-4 text-[10px] font-normal uppercase tracking-[0.22em] text-arena backdrop-blur-sm transition-colors duration-300 hover:border-oxido hover:text-yeso md:bottom-8 md:left-8"
      >
        <Download size={14} strokeWidth={1.5} />
        Instalar app
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5" role="dialog" aria-modal="true">
          <div className="animate-fade-up absolute inset-0 bg-carbon-950/80 backdrop-blur-sm" onClick={() => setAbierto(false)} />
          <div className="animate-fade-up relative w-full max-w-sm bg-yeso p-8 text-left">
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center text-oliva-oscuro transition-colors hover:text-carbon"
            >
              <X size={16} strokeWidth={1.5} />
            </button>

            <div className="flex items-center gap-4">
              <Image src="/icons/icon-192.png" alt="" width={48} height={48} />
              <div>
                <p className="text-[15px] text-carbon">Entreobra en tu celular</p>
                <p className="mt-0.5 text-xs text-oliva-oscuro">Como cualquier app, a un toque</p>
              </div>
            </div>

            {esIOS ? (
              <ol className="mt-7 space-y-4 border-t border-arena pt-6">
                {PASOS_IOS.map((paso, i) => (
                  <li key={i} className="flex gap-4 text-sm leading-relaxed text-tierra/85">
                    <span className="pt-px text-[11px] tracking-[0.2em] text-oxido">{String(i + 1).padStart(2, "0")}</span>
                    <p>{paso}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <>
                <p className="mt-7 border-t border-arena pt-6 text-sm leading-relaxed text-tierra/85">
                  Te queda un ícono como cualquier app, abre a pantalla completa y funciona más rápido — sin
                  pasar por una tienda de apps.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    await instalar();
                    setAbierto(false);
                  }}
                  className="boton boton-oxido mt-7 w-full"
                >
                  Instalar Entreobra
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
