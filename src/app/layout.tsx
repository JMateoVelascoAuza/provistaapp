import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { BackToTop } from "@/components/ui/BackToTop";
import { SectionDots } from "@/components/ui/SectionDots";
import "./globals.css";

// Poppins autohospedada (next/font/local) — nunca next/font/google, que
// depende de una conexión a Google Fonts en cada build (ver AGENTS.md).
// Archivos descargados una sola vez a src/fonts/.
const poppins = localFont({
  src: [
    { path: "../fonts/poppins-300.woff2", weight: "300", style: "normal" },
    { path: "../fonts/poppins-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/poppins-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/poppins-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

// TODO: reemplazar título/descripción si el Anexo A trae copy oficial
// distinto a este placeholder.
export const metadata: Metadata = {
  title: "Provista — Todos los materiales de tu obra, en un solo lugar",
  description:
    "Provista conecta obra y proveedores de materiales de construcción en Cochabamba. Compara precios, tiempos de entrega y proveedores reales.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c2340",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${poppins.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <ScrollProgressBar />
        <Header />
        {children}
        <Footer />
        <BackToTop />
        <SectionDots />
      </body>
    </html>
  );
}
