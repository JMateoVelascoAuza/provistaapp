"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, PlusSquare, Share2, X } from "lucide-react";
import { useIdioma } from "@/lib/preferencias";
import { usePwaInstall } from "@/lib/usePwaInstall";

export function InstalarPwa() {
  const { puedeInstalarNativo, instalada, esIOS, instalar } = usePwaInstall();
  const [abierto, setAbierto] = useState(false);
  const { t } = useIdioma();
  const ti = t.instalar;
  const pasosIos = [
    <>
      {ti.iosCompartir[0]}
      <span className="text-carbon">{ti.iosCompartir[1]}</span>{" "}
      <Share2 size={13} strokeWidth={1.5} className="mb-0.5 inline" />
      {ti.iosCompartir[2]}
    </>,
    <>
      {ti.iosAgregar[0]}
      <span className="text-carbon">
        {ti.iosAgregar[1]} <PlusSquare size={13} strokeWidth={1.5} className="mb-0.5 inline" />
      </span>
      {ti.iosAgregar[2]}
    </>,
    <>
      {ti.iosListo[0]}
      <span className="text-carbon">{ti.iosListo[1]}</span>
      {ti.iosListo[2]}
    </>,
  ];

  if (instalada || (!puedeInstalarNativo && !esIOS)) return null;

  return (
    <>
      <button
        type="button"
        data-zona="oscura"
        onClick={() => setAbierto(true)}
        className="fixed bottom-5 left-5 z-30 flex h-11 items-center gap-2.5 border border-yeso/15 bg-carbon/90 px-4 text-[10px] font-normal uppercase tracking-[0.22em] text-arena backdrop-blur-sm transition-colors duration-300 hover:border-oxido hover:text-yeso md:bottom-8 md:left-8"
      >
        <Download size={14} strokeWidth={1.5} />
        {ti.boton}
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5" role="dialog" aria-modal="true">
          <div className="animate-fade-up absolute inset-0 bg-carbon-950/80 backdrop-blur-sm" onClick={() => setAbierto(false)} />
          <div className="animate-fade-up relative w-full max-w-sm bg-yeso p-8 text-left">
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label={ti.cerrar}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center text-oliva-oscuro transition-colors hover:text-carbon"
            >
              <X size={16} strokeWidth={1.5} />
            </button>

            <div className="flex items-center gap-4">
              <Image src="/icons/icon-192.png" alt="" width={48} height={48} />
              <div>
                <p className="text-[15px] text-carbon">{ti.titulo}</p>
                <p className="mt-0.5 text-xs text-oliva-oscuro">{ti.sub}</p>
              </div>
            </div>

            {esIOS ? (
              <ol className="mt-7 space-y-4 border-t border-arena pt-6">
                {pasosIos.map((paso, i) => (
                  <li key={i} className="flex gap-4 text-sm leading-relaxed text-tierra/85">
                    <span className="pt-px text-[11px] tracking-[0.2em] text-oxido">{String(i + 1).padStart(2, "0")}</span>
                    <p>{paso}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <>
                <p className="mt-7 border-t border-arena pt-6 text-sm leading-relaxed text-tierra/85">
                  {ti.texto}
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    await instalar();
                    setAbierto(false);
                  }}
                  className="boton boton-oxido mt-7 w-full"
                >
                  {ti.instalar}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
