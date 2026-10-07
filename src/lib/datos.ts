import type { Textura } from "@/components/ui/Foto";

export const PROVEEDORES = [
  { nombre: "Ferretería A", entrega: "24 h", distancia: "2.1 km", stock: "180 bolsas en stock", precio: 2600 },
  { nombre: "Ferretería B", entrega: "48 h", distancia: "3.8 km", stock: "90 bolsas en stock", precio: 2710 },
  { nombre: "Distribuidora C", entrega: "72 h", distancia: "6.4 km", stock: "stock sin confirmar", precio: 2840, sinConfirmar: true },
];

export const WHATSAPP_ENTREOBRA = "59176971774";

export const NEGOCIO = {
  nombreComercial: "Entreobra",
  razonSocial: "",
  nit: "",
  matricula: "",
  direccion: "",
  ciudad: "Cochabamba, Bolivia",
  correo: "",
  whatsapp: "+591 76971774",
  sitio: "entreobra.com",
};

export const VERSION_POLITICAS = "2026-10-04";

const precios = PROVEEDORES.map((p) => p.precio);
export const AHORRO = Math.max(...precios) - Math.min(...precios);

export const CATEGORIAS: { nombre: string; detalle: string; textura: Textura; imagen?: string }[] = [
  { nombre: "Cemento", detalle: "IP-30, IP-40, blanco", textura: "concreto" },
  { nombre: "Fierro y acero", detalle: "Corrugado, alambre, mallas", textura: "fierro" },
  { nombre: "Áridos", detalle: "Arena, grava, ripio", textura: "aridos" },
  { nombre: "Ladrillos y bloques", detalle: "Gambote, 6 huecos, bloques", textura: "ladrillo" },
  { nombre: "Cerámicos", detalle: "Pisos, revestimientos, porcelanato", textura: "ceramico" },
  { nombre: "Tuberías y sanitarios", detalle: "PVC, desagüe, grifería", textura: "tubos" },
];

export function formatBs(valor: number, idioma: "es" | "en" = "es") {
  return `Bs ${String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, idioma === "en" ? "," : ".")}`;
}
