import { Check, MapPin, Package, Search, ShoppingCart, Star, Truck } from "lucide-react";

function BarraApp({ titulo }: { titulo: string }) {
  return (
    <div className="flex items-center justify-between bg-marino-900 px-4 py-3 text-white">
      <span className="text-sm font-semibold">{titulo}</span>
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold">
        P
      </span>
    </div>
  );
}

const PRODUCTOS_DEMO = [
  { nombre: "Cemento IP-30", precio: "Bs 62", color: "bg-naranja-200" },
  { nombre: "Fierro 3/8", precio: "Bs 48", color: "bg-marino-200" },
  { nombre: "Ladrillo 6H", precio: "Bs 1.8", color: "bg-amber-200" },
  { nombre: "Pintura 20L", precio: "Bs 320", color: "bg-emerald-200" },
];

export function MockCatalogo() {
  return (
    <div className="flex h-full flex-col">
      <BarraApp titulo="Catálogo" />
      <div className="flex items-center gap-2 border-b border-marino-100 px-3 py-2.5">
        <Search size={14} className="text-marino-400" />
        <span className="text-xs text-marino-400">Buscar material…</span>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2 overflow-hidden p-3">
        {PRODUCTOS_DEMO.map((p) => (
          <div key={p.nombre} className="overflow-hidden rounded-xl border border-marino-100">
            <div className={`flex h-14 items-center justify-center ${p.color}`}>
              <Package size={18} className="text-white/80" />
            </div>
            <div className="p-1.5">
              <p className="truncate text-[10px] font-medium text-marino-900">{p.nombre}</p>
              <p className="text-[10px] font-bold text-naranja-600">{p.precio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockCarrito() {
  const items = [
    { nombre: "Cemento IP-30 x5", precio: "Bs 310" },
    { nombre: "Fierro 3/8 x10", precio: "Bs 480" },
    { nombre: "Ladrillo 6H x200", precio: "Bs 360" },
  ];
  return (
    <div className="flex h-full flex-col">
      <BarraApp titulo="Tu pedido" />
      <div className="flex-1 space-y-2 p-3">
        {items.map((item) => (
          <div key={item.nombre} className="flex items-center gap-2 rounded-xl border border-marino-100 p-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-naranja-50 text-naranja-600">
              <ShoppingCart size={13} />
            </span>
            <span className="flex-1 truncate text-[11px] text-marino-700">{item.nombre}</span>
            <span className="text-[11px] font-semibold text-marino-900">{item.precio}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-marino-100 p-3">
        <div className="mb-2 flex justify-between text-xs font-semibold text-marino-900">
          <span>Total</span>
          <span>Bs 1.150</span>
        </div>
        <div className="rounded-lg bg-naranja-600 py-2 text-center text-[11px] font-semibold text-white">
          Confirmar pedido
        </div>
      </div>
    </div>
  );
}

export function MockSeguimiento() {
  const pasos = [
    { label: "Confirmado", activo: true },
    { label: "En preparación", activo: true },
    { label: "En camino", activo: true },
    { label: "Entregado", activo: false },
  ];
  return (
    <div className="flex h-full flex-col">
      <BarraApp titulo="Pedido #4821" />
      <div className="flex flex-1 items-center justify-center bg-marino-50">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
          <Truck size={28} className="text-naranja-600" />
        </div>
      </div>
      <div className="space-y-3 border-t border-marino-100 p-4">
        {pasos.map((paso) => (
          <div key={paso.label} className="flex items-center gap-2.5">
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full ${
                paso.activo ? "bg-naranja-600 text-white" : "bg-marino-100"
              }`}
            >
              {paso.activo && <Check size={10} />}
            </span>
            <span className={`text-[11px] ${paso.activo ? "font-medium text-marino-900" : "text-marino-400"}`}>
              {paso.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockDashboard() {
  return (
    <div className="flex h-full flex-col">
      <BarraApp titulo="Mi ferretería" />
      <div className="grid grid-cols-3 gap-1.5 p-3">
        {[
          { label: "Pedidos", valor: "128" },
          { label: "Pendientes", valor: "6" },
          { label: "Vendido", valor: "Bs 24k" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-marino-100 p-2 text-center">
            <p className="text-xs font-bold text-marino-900">{stat.valor}</p>
            <p className="text-[9px] text-marino-400">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="flex-1 space-y-2 px-3 pb-3">
        {["Edificio Torre del Bosque", "Casa Sacaba #12"].map((obra) => (
          <div key={obra} className="flex items-center justify-between rounded-lg border border-marino-100 p-2">
            <span className="truncate text-[10px] text-marino-700">{obra}</span>
            <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700">
              Nuevo
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockFletes() {
  const fletes = [
    { nombre: "Ferretería San Antonio", distancia: "2.1 km", rating: 4.6 },
    { nombre: "Materiales Cochabamba", distancia: "3.8 km", rating: 4.4 },
  ];
  return (
    <div className="flex h-full flex-col">
      <BarraApp titulo="Fletes disponibles" />
      <div className="flex-1 space-y-2.5 p-3">
        {fletes.map((flete) => (
          <div key={flete.nombre} className="rounded-xl border border-marino-100 p-2.5">
            <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-marino-900">
              <MapPin size={12} className="text-naranja-600" />
              {flete.nombre}
            </div>
            <div className="mb-2 flex items-center gap-2 text-[10px] text-marino-400">
              <span>{flete.distancia}</span>
              <span className="flex items-center gap-0.5">
                <Star size={9} className="fill-naranja-400 text-naranja-400" /> {flete.rating}
              </span>
            </div>
            <div className="rounded-md bg-marino-900 py-1.5 text-center text-[10px] font-semibold text-white">
              Aceptar
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
