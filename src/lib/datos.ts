import type { Textura } from "@/components/ui/Foto";

// Nombres y precios de ejemplo del comparador — fáciles de reemplazar
// antes de publicar. El ahorro de la barra de métricas del hero sale de
// acá, así los dos números nunca se contradicen.
export const PROVEEDORES = [
  { nombre: "Ferretería San Antonio", entrega: "24 h", distancia: "2.1 km", stock: "180 bolsas en stock", precio: 2600 },
  { nombre: "Materiales Cochabamba", entrega: "48 h", distancia: "3.8 km", stock: "90 bolsas en stock", precio: 2710 },
  { nombre: "Distribuidora Bolivia", entrega: "72 h", distancia: "6.4 km", stock: "stock sin confirmar", precio: 2840, sinConfirmar: true },
];

/** WhatsApp de Entreobra, en formato internacional sin "+" (para wa.me). */
export const WHATSAPP_ENTREOBRA = "59176971774";

const precios = PROVEEDORES.map((p) => p.precio);
export const AHORRO = Math.max(...precios) - Math.min(...precios);

/**
 * Las seis categorías del catálogo. `detalle` es la línea chica bajo el
 * nombre. `imagen` (ruta en /public) reemplaza la textura en cuanto haya
 * una foto real: según el manual de marca, materiales apilados de cada
 * categoría, propia de Cochabamba si se puede.
 */
export const CATEGORIAS: { nombre: string; detalle: string; textura: Textura; imagen?: string }[] = [
  { nombre: "Cemento", detalle: "5 productos · 3 marcas", textura: "concreto" },
  { nombre: "Fierro y acero", detalle: "Corrugado, alambre, mallas", textura: "fierro" },
  { nombre: "Áridos", detalle: "Arena, grava, ripio", textura: "aridos" },
  { nombre: "Ladrillos", detalle: "Gambote, bloques, cerámicos", textura: "ladrillo" },
  { nombre: "Tubos", detalle: "PVC, presión, desagüe", textura: "tubos" },
  { nombre: "Eléctricos", detalle: "Cables, ductos, tableros", textura: "electrico" },
];

// Separador de miles a mano (no toLocaleString): "es-BO" no agrupa
// números de 4 cifras en todos los motores, y servidor y navegador
// podrían renderizar distinto.
export function formatBs(valor: number) {
  return `Bs ${String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}
