import { Logo } from "@/components/ui/Logo";
import { PrivacyModal } from "@/components/ui/PrivacyModal";
import { ScrollStagger } from "@/components/ui/ScrollReveal";
import { WHATSAPP_ENTREOBRA } from "@/lib/datos";
import { cn } from "@/lib/utils";

// Usuario de redes según el manual de marca: @entreobra.
const REDES: { label: string; href?: string }[] = [
  { label: "Instagram", href: "https://www.instagram.com/entreobra" },
  { label: "Facebook", href: "https://www.facebook.com/entreobra" },
  { label: "TikTok", href: "https://www.tiktok.com/@entreobra" },
];

// Los dos tratamientos del logo principal del manual: sobre yeso
// (landing) y sobre carbón (demo).
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
  const enlace = cn("transition-colors duration-300", t.enlace);

  return (
    <footer className={cn("border-t", t.footer)}>
      <ScrollStagger stagger={0.1} className="contenedor grid gap-12 py-16 sm:grid-cols-3 md:py-20">
        <div>
          <Logo variante="principal" fondo={t.fondoLogo} animado="scroll" className="text-[20px] md:text-[26px]" />
          <p className={cn("mt-6 text-[13px]", t.etiqueta)}>Cochabamba, Bolivia</p>
        </div>

        <div className="sm:justify-self-center">
          <p className={cn("etiqueta text-[10px]", t.etiqueta)}>Contacto</p>
          <div className={cn("mt-5 flex flex-col gap-2 text-[13px]", t.texto)}>
            <a href={`https://wa.me/${WHATSAPP_ENTREOBRA}`} target="_blank" rel="noopener noreferrer" className={enlace}>
              WhatsApp +591 76971774
            </a>
            <a href="mailto:hola@entreobra.com" className={enlace}>
              hola@entreobra.com
            </a>
          </div>
        </div>

        <div className="sm:justify-self-end sm:text-right">
          <p className={cn("etiqueta text-[10px]", t.etiqueta)}>Síguenos</p>
          <p className={cn("mt-5 text-[13px]", t.texto)}>
            {REDES.map((red, i) => (
              <span key={red.label}>
                {i > 0 && <span className={cn("mx-2", t.separador)}>·</span>}
                <a href={red.href} target="_blank" rel="noopener noreferrer" className={enlace}>
                  {red.label}
                </a>
              </span>
            ))}
          </p>
        </div>
      </ScrollStagger>

      {/* Sin animación de entrada: al final de la página nunca llega al
          punto que la dispara, y quedaba invisible y corrida hacia abajo
          (dejaba ver el fondo del body bajo el footer). */}
      <div className="contenedor">
        <div
          className={cn(
            "flex flex-col gap-3 border-t py-7 text-xs sm:flex-row sm:items-center sm:justify-between",
            t.linea,
            t.pie,
          )}
        >
          <p>© {new Date().getFullYear()} Entreobra</p>
          <PrivacyModal className={t.enlace} />
        </div>
      </div>
    </footer>
  );
}
