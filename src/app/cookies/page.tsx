import type { Metadata } from "next";
import { PaginaLegal } from "@/components/legal/PaginaLegal";

export const metadata: Metadata = {
  title: "Política de cookies — Entreobra",
  description: "Entreobra no usa cookies: qué guarda el sitio en tu navegador y por qué.",
};

export default function Pagina() {
  return <PaginaLegal documento="cookies" />;
}
