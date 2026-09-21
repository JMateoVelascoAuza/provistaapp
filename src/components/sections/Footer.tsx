import { Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { PrivacyModal } from "@/components/ui/PrivacyModal";

// lucide-react ya no incluye logos de marca (Instagram/Facebook/TikTok)
// por temas de licencia, así que van como SVG simple — son íconos de
// plataforma estándar, no una decisión de identidad de Provista.
function IconoInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconoFacebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M15 8.5h2V5.2c-.4-.05-1.5-.2-2.7-.2-2.7 0-4.5 1.6-4.5 4.6v2.4H7v3.6h2.8V21h3.6v-5.4h2.8l.5-3.6h-3.3V9.9c0-1 .3-1.4 1.6-1.4Z" />
    </svg>
  );
}

function IconoTikTok(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.6 5.8a4.3 4.3 0 0 1-3.1-3.1h-2.7v13.2a2.6 2.6 0 1 1-1.8-2.5v-2.8a5.4 5.4 0 1 0 4.5 5.3V9.1a7 7 0 0 0 3.1.7z" />
    </svg>
  );
}

// TODO: reemplazar WhatsApp/correo/redes con los datos reales del
// cliente en cuanto los confirme (WhatsApp queda "a definir" según el
// documento de contenido).
export function Footer() {
  return (
    <footer className="bg-gris-seccion py-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-3 sm:px-8">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-marino-500">Materiales de construcción, ordenados por obra.</p>
          <p className="mt-1 text-sm text-marino-400">Cochabamba, Bolivia</p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-marino-400">Contacto</p>
          <div className="flex flex-col gap-1.5 text-sm text-marino-500">
            <span>WhatsApp: +591 ___ _____</span>
            <a href="mailto:contacto@provistabo.com" className="flex items-center gap-1.5 hover:text-marino-900">
              <Mail size={14} /> contacto@provistabo.com
            </a>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-marino-400">Síguenos</p>
          <div className="flex items-center gap-3 text-marino-400">
            <a href="#" aria-label="Instagram" className="transition hover:scale-110 hover:text-marino-900">
              <IconoInstagram width={18} height={18} />
            </a>
            <a href="#" aria-label="Facebook" className="transition hover:scale-110 hover:text-marino-900">
              <IconoFacebook width={18} height={18} />
            </a>
            <a href="#" aria-label="TikTok" className="transition hover:scale-110 hover:text-marino-900">
              <IconoTikTok width={18} height={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-2 border-t border-marino-100 px-4 pt-6 text-xs text-marino-400 sm:flex-row sm:px-8">
        <p>© {new Date().getFullYear()} Provista</p>
        <PrivacyModal />
      </div>
    </footer>
  );
}
