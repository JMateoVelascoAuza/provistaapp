import { cn } from "@/lib/utils";
import marco from "./iphone-marco.webp";

// Medidas de la pantalla dentro de `iphone-marco.webp`, en fracción de
// la imagen (sacadas del archivo original píxel a píxel). La pantalla
// del marco es transparente: la app se pinta debajo y la isla y la
// barra de estado del dibujo quedan encima, como en un teléfono real.
const PANTALLA = { left: 0.040097, top: 0.016106, width: 0.919807, height: 0.967787, radioX: 0.14496, radioY: 0.06657 };

// La capa de la app se mete un poco bajo el bisel negro del marco: así
// el filo antialiasado del contenido queda tapado y no asoma una línea
// clara entre la pantalla y el borde del teléfono.
const SANGRADO = 0.003;
export const CAPA_APP = {
  left: PANTALLA.left - SANGRADO,
  top: PANTALLA.top - SANGRADO / 2,
  width: PANTALLA.width + SANGRADO * 2,
  height: PANTALLA.height + SANGRADO,
  radioX: PANTALLA.radioX,
  radioY: PANTALLA.radioY,
};

// La app se diseña a tamaño lógico de iPhone (393 pt de ancho) y se
// escala para calzar en la pantalla, así el texto y los espacios
// guardan proporciones reales en cualquier tamaño de marco.
export const ANCHO_APP = 393;


const pct = (v: number) => `${v * 100}%`;

// Alto lógico que corresponde a la capa de la app con ese ancho.
const ALTO_APP = Math.round((ANCHO_APP * CAPA_APP.height * marco.height) / (CAPA_APP.width * marco.width));

/**
 * El ancho sale de la variable `--ancho` (número de píxeles, sin
 * unidad, porque también calcula la escala de la app). Quien lo usa la
 * define con clases, p. ej. `[--ancho:240] lg:[--ancho:280]`.
 */
export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn("relative w-[calc(var(--ancho)*1px)]", className ?? "[--ancho:150] sm:[--ancho:205] md:[--ancho:265]")}
      style={{ aspectRatio: `${marco.width} / ${marco.height}` }}
    >
      <div
        aria-hidden
        className="absolute shadow-[0_40px_70px_-20px_rgb(36_34_32/0.5)]"
        style={{
          left: pct(PANTALLA.left),
          top: pct(PANTALLA.top),
          width: pct(PANTALLA.width),
          height: pct(PANTALLA.height),
          borderRadius: `${pct(PANTALLA.radioX)} / ${pct(PANTALLA.radioY)}`,
        }}
      />
      <div
        data-zona="foto"
        className="absolute overflow-hidden bg-carbon"
        style={{
          left: pct(CAPA_APP.left),
          top: pct(CAPA_APP.top),
          width: pct(CAPA_APP.width),
          height: pct(CAPA_APP.height),
          borderRadius: `${pct(CAPA_APP.radioX)} / ${pct(CAPA_APP.radioY)}`,
        }}
      >
        <div
          className="origin-top-left"
          style={{
            width: ANCHO_APP,
            height: ALTO_APP,
            transform: `scale(calc(var(--ancho) * ${CAPA_APP.width} / ${ANCHO_APP}))`,
          }}
        >
          {children}
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- la build estática (file://) no admite next/image optimizado */}
      <img
        src={marco.src}
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      />
    </div>
  );
}
