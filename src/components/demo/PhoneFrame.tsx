import { cn } from "@/lib/utils";
import marco from "./iphone-marco.webp";

const PANTALLA = { left: 0.040097, top: 0.016106, width: 0.919807, height: 0.967787, radioX: 0.14496, radioY: 0.06657 };

const SANGRADO = 0.003;
export const CAPA_APP = {
  left: PANTALLA.left - SANGRADO,
  top: PANTALLA.top - SANGRADO / 2,
  width: PANTALLA.width + SANGRADO * 2,
  height: PANTALLA.height + SANGRADO,
  radioX: PANTALLA.radioX,
  radioY: PANTALLA.radioY,
};

export const ANCHO_APP = 393;


const pct = (v: number) => `${v * 100}%`;

const ALTO_APP = Math.round((ANCHO_APP * CAPA_APP.height * marco.height) / (CAPA_APP.width * marco.width));

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
      <img
        src={marco.src}
        alt=""
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      />
    </div>
  );
}
