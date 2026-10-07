import type { Metadata } from "next";
import { PaginaLegal } from "@/components/legal/PaginaLegal";

export const metadata: Metadata = {
  title: "Términos y condiciones — Entreobra",
  description: "Reglas de uso del sitio, el acceso anticipado y el registro de productos de Entreobra.",
};

export default function Pagina() {
  return <PaginaLegal documento="terminos" />;
}
