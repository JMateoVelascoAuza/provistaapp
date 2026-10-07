import type { Textura } from "@/components/ui/Foto";

// Nombres y precios de ejemplo del comparador. Los nombres son ficticios a
// propósito: no usar nombres de negocios reales con precios inventados. El
// ahorro de la barra de métricas del hero sale de acá, así los dos números
// nunca se contradicen.
export const PROVEEDORES = [
  { nombre: "Ferretería A", entrega: "24 h", distancia: "2.1 km", stock: "180 bolsas en stock", precio: 2600 },
  { nombre: "Ferretería B", entrega: "48 h", distancia: "3.8 km", stock: "90 bolsas en stock", precio: 2710 },
  { nombre: "Distribuidora C", entrega: "72 h", distancia: "6.4 km", stock: "stock sin confirmar", precio: 2840, sinConfirmar: true },
];

/** WhatsApp de Entreobra, en formato internacional sin "+" (para wa.me). */
export const WHATSAPP_ENTREOBRA = "59176971774";

/**
 * Datos del negocio que muestran el pie y las páginas legales. Los vacíos
 * no se muestran: completarlos con los datos reales (SEPREC / Impuestos
 * Nacionales) antes de publicar. No inventar valores.
 */
export const NEGOCIO = {
  nombreComercial: "Entreobra",
  razonSocial: "",
  nit: "",
  matricula: "", // Matrícula de comercio (SEPREC)
  direccion: "",
  ciudad: "Cochabamba, Bolivia",
  // Vacío hasta que exista: entreobra.com todavía no está registrado, así
  // que hola@entreobra.com no recibe correos. Sin correo, el sitio muestra
  // solo WhatsApp (Anexo de la Adenda N.º 1: ocultar contactos que no existan).
  correo: "",
  whatsapp: "+591 76971774",
  sitio: "entreobra.com",
};

/** Fecha de la versión vigente de las políticas (se guarda con cada consentimiento). */
export const VERSION_POLITICAS = "2026-10-04";

const precios = PROVEEDORES.map((p) => p.precio);
export const AHORRO = Math.max(...precios) - Math.min(...precios);

/**
 * Las seis categorías del catálogo (Anexo de la Adenda N.º 1). `detalle`
 * es la línea chica bajo el nombre. `imagen` (ruta en /public) reemplaza la textura en cuanto haya
 * una foto real: según el manual de marca, materiales apilados de cada
 * categoría, propia de Cochabamba si se puede.
 */
export const CATEGORIAS: { nombre: string; detalle: string; textura: Textura; imagen?: string }[] = [
  { nombre: "Cemento", detalle: "IP-30, IP-40, blanco", textura: "concreto" },
  { nombre: "Fierro y acero", detalle: "Corrugado, alambre, mallas", textura: "fierro" },
  { nombre: "Áridos", detalle: "Arena, grava, ripio", textura: "aridos" },
  { nombre: "Ladrillos y bloques", detalle: "Gambote, 6 huecos, bloques", textura: "ladrillo" },
  { nombre: "Cerámicos", detalle: "Pisos, revestimientos, porcelanato", textura: "ceramico" },
  { nombre: "Tuberías y sanitarios", detalle: "PVC, desagüe, grifería", textura: "tubos" },
];

// Separador de miles a mano (punto en español, coma en inglés) (no toLocaleString): "es-BO" no agrupa
// números de 4 cifras en todos los motores, y servidor y navegador
// podrían renderizar distinto.
export function formatBs(valor: number, idioma: "es" | "en" = "es") {
  return `Bs ${String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, idioma === "en" ? "," : ".")}`;
}
