import { cn } from "@/lib/utils";

export type Textura =
  | "encofrado"
  | "concreto"
  | "fierro"
  | "aridos"
  | "ladrillo"
  | "tubos"
  | "electrico"
  | "malla"
  | "deposito";

/**
 * Bloque fotográfico de la zona atmosférica. Hoy pinta una textura
 * generada (marcador de posición, ver "Pendientes" de la spec); cuando
 * lleguen las fotos reales alcanza con pasar `src` — se aplican solas
 * el tratamiento de marca (desaturada, sombras viradas a carbón) y la
 * capa carbón obligatoria para cualquier foto con texto encima.
 *
 * `velo` es la opacidad de esa capa carbón (spec: 40–60%).
 */
export function Foto({
  textura,
  src,
  alt = "",
  velo = 0.5,
  className,
  imagenClassName,
}: {
  textura: Textura;
  src?: string;
  alt?: string;
  velo?: number;
  className?: string;
  /** Clases extra para la capa de imagen/textura (p. ej. zoom en hover). */
  imagenClassName?: string;
}) {
  return (
    <div aria-hidden={!src || !alt} className={cn("absolute inset-0 overflow-hidden", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- la build estática (file://) no admite next/image optimizado
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={cn("absolute inset-0 h-full w-full object-cover grayscale-[0.85] contrast-[1.05]", imagenClassName)}
        />
      ) : (
        <div className={cn(`tex-${textura} absolute inset-0`, imagenClassName)} />
      )}
      {src && <div className="absolute inset-0 bg-carbon mix-blend-color" style={{ opacity: 0.35 }} />}
      <div className="tex-grano absolute inset-0 opacity-[0.22]" />
      {/* Manual de marca: toda foto con texto encima lleva carbón al
          40–60%. Las texturas de reemplazo usan el `velo` que se pida. */}
      <div className="foto-velo absolute inset-0 bg-carbon" style={{ opacity: src ? Math.min(0.6, Math.max(0.4, velo)) : velo }} />
    </div>
  );
}
