import type { Metadata } from "next";
import { PaginaLegal } from "@/components/legal/PaginaLegal";

export const metadata: Metadata = {
  title: "Política de reembolsos — Entreobra",
  description: "Entreobra no cobra hoy: condiciones de pagos y reembolsos.",
};

export default function Pagina() {
  return <PaginaLegal documento="reembolsos" />;
}
