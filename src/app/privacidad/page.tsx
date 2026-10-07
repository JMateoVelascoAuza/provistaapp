import type { Metadata } from "next";
import { PaginaLegal } from "@/components/legal/PaginaLegal";

export const metadata: Metadata = {
  title: "Política de privacidad — Entreobra",
  description: "Qué datos recoge Entreobra, para qué los usa y cómo ejercer tus derechos.",
};

export default function Pagina() {
  return <PaginaLegal documento="privacidad" />;
}
