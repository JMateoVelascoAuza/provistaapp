"use client";

import { Logo } from "@/components/ui/Logo";
import { Enlace } from "@/components/ui/Enlace";
import { ScrollStagger } from "@/components/ui/ScrollReveal";
import { NEGOCIO, WHATSAPP_ENTREOBRA } from "@/lib/datos";
import { LEGAL, RUTAS_LEGALES, type DocumentoLegal } from "@/lib/legal";
import { useIdioma } from "@/lib/preferencias";
import { cn } from "@/lib/utils";

const REDES: { label: string; href?: string }[] = [
  { label: "Instagram" },
  { label: "Facebook" },
  { label: "TikTok" },
];
const REDES_CONFIRMADAS = REDES.filter((red) => red.href);

const TONOS = {
  claro: {
    footer: "border-arena bg-yeso",
    fondoLogo: "yeso",
    etiqueta: "text-oliva-oscuro",
    texto: "text-tierra/80",
    enlace: "hover:text-carbon",
    separador: "text-arena",
    linea: "border-arena",
    pie: "text-oliva-oscuro",
  },
  oscuro: {
    footer: "border-yeso/6 bg-carbon",
    fondoLogo: "carbon",
    etiqueta: "text-oliva",
    texto: "text-arena/75",
    enlace: "hover:text-yeso",
    separador: "text-oliva/60",
    linea: "border-yeso/6",
    pie: "text-oliva",
  },
} as const;

export function Footer({ tono = "oscuro" }: { tono?: keyof typeof TONOS }) {
  const t = TONOS[tono];
  const { idioma, t: tx } = useIdioma();
  const legal = LEGAL[idioma];
  const enlace = cn("transition-colors duration-300", t.enlace);

  return (
    <footer data-zona={tono === "oscuro" ? "oscura" : undefined} className={cn("border-t", t.footer)}>
      <ScrollStagger stagger={0.1} className="contenedor grid gap-12 py-16 sm:grid-cols-3 md:py-20">
        <div>
          <Logo variante="principal" fondo={t.fondoLogo} animado="scroll" className="text-[20px] md:text-[26px]" />
          <p className={cn("mt-6 text-[13px]", t.etiqueta)}>{tx.footer.ubicacion}</p>
        </div>

        <div className={REDES_CONFIRMADAS.length > 0 ? "sm:justify-self-center" : "sm:justify-self-end sm:text-right"}>
          <p className={cn("etiqueta text-[10px]", t.etiqueta)}>{tx.footer.contacto}</p>
          <div className={cn("mt-5 flex flex-col gap-2 text-[13px]", t.texto)}>
            <a href={`https://wa.me/${WHATSAPP_ENTREOBRA}`} target="_blank" rel="noopener noreferrer" className={enlace}>
              WhatsApp +591 76971774
            </a>
            {NEGOCIO.correo && (
              <a href={`mailto:${NEGOCIO.correo}`} className={enlace}>
                {NEGOCIO.correo}
              </a>
            )}
          </div>
        </div>

        {REDES_CONFIRMADAS.length > 0 && (
          <div className="sm:justify-self-end sm:text-right">
            <p className={cn("etiqueta text-[10px]", t.etiqueta)}>{tx.footer.siguenos}</p>
            <p className={cn("mt-5 text-[13px]", t.texto)}>
              {REDES_CONFIRMADAS.map((red, i) => (
                <span key={red.label}>
                  {i > 0 && <span className={cn("mx-2", t.separador)}>·</span>}
                  <a href={red.href} target="_blank" rel="noopener noreferrer" className={enlace}>
                    {red.label}
                  </a>
                </span>
              ))}
            </p>
          </div>
        )}
      </ScrollStagger>

      <div className="contenedor">
        <div
          className={cn(
            "flex flex-col gap-3 border-t py-7 text-xs sm:flex-row sm:items-center sm:justify-between",
            t.linea,
            t.pie,
          )}
        >
          <p>
            © {new Date().getFullYear()} {NEGOCIO.razonSocial || NEGOCIO.nombreComercial}
            {NEGOCIO.nit && ` · NIT ${NEGOCIO.nit}`}
          </p>
          <nav aria-label={legal.etiqueta} className="flex flex-wrap gap-x-5 gap-y-2">
            {(Object.keys(RUTAS_LEGALES) as DocumentoLegal[]).map((doc) => (
              <Enlace key={doc} href={RUTAS_LEGALES[doc]} className={cn("py-1", enlace)}>
                {legal.enlaces[doc]}
              </Enlace>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
