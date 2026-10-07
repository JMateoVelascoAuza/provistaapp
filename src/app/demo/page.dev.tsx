import type { Metadata } from "next";
import { DemoContenido } from "@/components/demo/DemoContenido";

export const metadata: Metadata = {
  title: "Demo — Entreobra",
  description: "Una mirada por dentro a la app completa de Entreobra.",
};

export default function DemoPage() {
  return <DemoContenido />;
}
