import type { Metadata, Viewport } from "next";
import { Header } from "@/components/sections/Header";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { BackToTop } from "@/components/ui/BackToTop";
import { InstalarPwa } from "@/components/ui/InstalarPwa";
import { SaltarContenido } from "@/components/ui/SaltarContenido";
import { LimpiarServiceWorkerDev } from "@/components/ui/LimpiarServiceWorkerDev";
import { PreferenciasProvider, SCRIPT_PREFERENCIAS } from "@/lib/preferencias";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://entreobra.com"),
  title: "Entreobra — Entre tu obra y tu proveedor",
  description:
    "Compara precios y stock de materiales de construcción en Cochabamba. Mira quién tiene stock ahora y a qué precio, sin perder la mañana en WhatsApp.",
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/favicon.png", sizes: "64x64", type: "image/png" }],
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Entreobra",
  },
  openGraph: {
    title: "Entreobra — Entre tu obra y tu proveedor",
    description: "Compara precios y stock de materiales de construcción en Cochabamba.",
    siteName: "Entreobra",
    locale: "es_BO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#242220",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_PREFERENCIAS }} />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <PreferenciasProvider>
          <SaltarContenido />
          <LimpiarServiceWorkerDev />
          <ScrollProgressBar />
          <Header />
          {children}
          <BackToTop />
          <InstalarPwa />
        </PreferenciasProvider>
      </body>
    </html>
  );
}
