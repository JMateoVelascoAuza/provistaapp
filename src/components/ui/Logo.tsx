import { cn } from "@/lib/utils";

/**
 * Ícono circular + wordmark en minúscula con línea naranja debajo,
 * según el documento de contenido ("Barra superior"). El ícono en sí
 * (Anexo C) todavía es un placeholder de texto — el resto (tipografía,
 * color, subrayado) ya es el diseño de marca real.
 */
export function Logo({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
          dark ? "bg-white text-marino-900" : "bg-marino-900 text-white",
        )}
      >
        P
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("text-lg font-light", dark ? "text-white" : "text-marino-900")}>
          provista
        </span>
        <span className="mt-1 h-0.5 w-6 rounded-full bg-naranja-600" />
      </span>
    </span>
  );
}
