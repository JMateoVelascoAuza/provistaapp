"use client";

import { useState } from "react";
import { Check, ClipboardList, PackageSearch, Truck } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

const PASOS = [
  {
    titulo: "Registra tu obra",
    descripcion: "Tus pedidos y gastos quedan ordenados por proyecto.",
  },
  {
    titulo: "Busca el material",
    descripcion: "Ves quién lo tiene y a qué precio, al instante.",
  },
  {
    titulo: "Arma tu pedido",
    descripcion: "Un solo pedido, aunque venga de varios proveedores.",
    etiqueta: "Lo que nadie más hace",
  },
  {
    titulo: "Recibe en obra",
    descripcion: "Sabes cuándo sale y cuándo llega. Sin preguntar.",
  },
] as const;

function PanelObra() {
  return (
    <div className="rounded-xl border border-marino-100 bg-white p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-marino-400">Nueva obra</p>
      <div className="space-y-2.5">
        <div className="rounded-lg border border-marino-100 px-3.5 py-2.5 text-sm text-marino-700">
          Edificio Torre del Bosque
        </div>
        <div className="rounded-lg border border-marino-100 px-3.5 py-2.5 text-sm text-marino-400">
          Cochabamba · Cercado
        </div>
        <button className="w-full rounded-lg bg-naranja-600 py-2.5 text-sm font-semibold text-white">
          Crear obra
        </button>
      </div>
    </div>
  );
}

function PanelPrecios() {
  const filas = [
    { nombre: "Ferretería San Antonio", precio: "Bs 2.600" },
    { nombre: "Materiales Cochabamba", precio: "Bs 2.710" },
    { nombre: "Distribuidora Bolivia", precio: "Bs 2.840" },
  ];
  return (
    <div className="rounded-xl border border-marino-100 bg-white p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-marino-400">Cemento IP-30</p>
      <div className="space-y-2">
        {filas.map((fila) => (
          <div key={fila.nombre} className="flex items-center justify-between rounded-lg border border-marino-100 px-3.5 py-2.5 text-sm">
            <span className="text-marino-700">{fila.nombre}</span>
            <span className="font-semibold text-marino-900">{fila.precio}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PanelPedido() {
  return (
    <div className="rounded-xl border border-marino-100 bg-white p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-marino-400">Tu pedido</p>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-marino-700">
          <span>Cemento · San Antonio</span>
          <span>Bs 2.600</span>
        </div>
        <div className="flex justify-between text-marino-700">
          <span>Fierro · Cochabamba</span>
          <span>Bs 1.150</span>
        </div>
        <div className="flex justify-between text-marino-700">
          <span>Ladrillo · Bolivia</span>
          <span>Bs 890</span>
        </div>
        <div className="flex justify-between border-t border-marino-100 pt-2 font-semibold text-marino-900">
          <span>Total</span>
          <span>Bs 4.640</span>
        </div>
      </div>
    </div>
  );
}

function PanelProgreso() {
  const estados = ["Confirmado", "En preparación", "En camino", "Entregado"];
  return (
    <div className="rounded-xl border border-marino-100 bg-white p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-marino-400">Estado del pedido</p>
      <div className="flex items-center">
        {estados.map((estado, i) => (
          <div key={estado} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-white",
                  i <= 1 ? "bg-naranja-600" : "bg-marino-100 text-marino-400",
                )}
              >
                {i <= 1 ? <Check size={13} /> : i + 1}
              </span>
              <span className="text-center text-[11px] text-marino-500">{estado}</span>
            </div>
            {i < estados.length - 1 && (
              <div className={cn("mx-1 h-0.5 flex-1", i < 1 ? "bg-naranja-600" : "bg-marino-100")} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const PANELES = [PanelObra, PanelPrecios, PanelPedido, PanelProgreso];
const ICONOS_PASO = [PackageSearch, ClipboardList, Truck, Check];

export function ComoFunciona() {
  const [activo, setActivo] = useState(0);
  const Panel = PANELES[activo];

  return (
    <section id="como-funciona" className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        <ScrollReveal className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-marino-900 sm:text-3xl">
            Con Provista son cuatro pasos
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-10 rounded-3xl border border-marino-100 bg-gris-seccion p-4 sm:p-8">
          <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-4">
            {PASOS.map((paso, i) => {
              const activoActual = activo === i;
              return (
                <button
                  key={paso.titulo}
                  onClick={() => setActivo(i)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition sm:justify-center",
                    activoActual ? "bg-marino-900 text-white" : "bg-white text-marino-500 hover:bg-white/70",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      activoActual ? "bg-naranja-500 text-white" : "bg-marino-100 text-marino-500",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="whitespace-nowrap">{paso.titulo}</span>
                </button>
              );
            })}
          </div>

          <div key={activo} className="animate-slide-fade mt-6 grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              {"etiqueta" in PASOS[activo] && (
                <span className="mb-2 inline-block rounded-full bg-naranja-100 px-3 py-1 text-xs font-semibold text-naranja-700">
                  {PASOS[activo].etiqueta}
                </span>
              )}
              <h3 className="flex items-center gap-2 text-lg font-semibold text-marino-900">
                {(() => {
                  const Icono = ICONOS_PASO[activo];
                  return <Icono size={18} className="text-naranja-600" />;
                })()}
                {PASOS[activo].titulo}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-marino-500">{PASOS[activo].descripcion}</p>
            </div>
            <Panel />
          </div>
        </ScrollReveal>

        <p className="mt-8 text-center text-lg font-medium text-marino-900">
          Toda la mañana en WhatsApp, resuelta en minutos.
        </p>
      </div>
    </section>
  );
}
