import { cn } from "@/lib/utils";

export type Textura =
  | "encofrado"
  | "concreto"
  | "fierro"
  | "aridos"
  | "ladrillo"
  | "tubos"
  | "ceramico"
  | "malla"
  | "deposito";

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
  imagenClassName?: string;
}) {
  return (
    <div aria-hidden={!src || !alt} className={cn("absolute inset-0 overflow-hidden", className)}>
      {src ? (
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
      <div className="foto-velo absolute inset-0 bg-carbon" style={{ opacity: src ? Math.min(0.6, Math.max(0.4, velo)) : velo }} />
    </div>
  );
}
