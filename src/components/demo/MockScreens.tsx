import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  Check,
  ChevronRight,
  ClipboardList,
  House,
  LayoutGrid,
  MapPin,
  Minus,
  Navigation,
  Package,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Store,
  Truck,
  User,
  Wallet,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AHORRO, formatBs, PROVEEDORES } from "@/lib/datos";
import { useIdioma } from "@/lib/preferencias";
import { cn } from "@/lib/utils";

/*
 * Pantallas de la app a tamaño lógico de iPhone (393×856 pt — ver
 * PhoneFrame). Arriba queda libre la franja de la barra de estado del
 * marco (hora, isla, batería en blanco), por eso el encabezado es
 * carbón; abajo, la barra de pestañas también es oscura para que el
 * indicador de inicio claro del dibujo se lea.
 */

type Pestana = { label: string; icono: LucideIcon };

const ICONOS_COMPRADOR: LucideIcon[] = [House, Search, ShoppingCart, Building2];
const ICONOS_FERRETERIA: LucideIcon[] = [BarChart3, ClipboardList, LayoutGrid, Store];
const ICONOS_CHOFER: LucideIcon[] = [Truck, Navigation, Wallet, User];

function pestanas(iconos: LucideIcon[], etiquetas: string[]): Pestana[] {
  return iconos.map((icono, i) => ({ label: etiquetas[i], icono }));
}

function PantallaApp({
  etiqueta,
  titulo,
  extra,
  pestanas,
  activa,
  children,
}: {
  etiqueta: string;
  titulo: string;
  extra?: React.ReactNode;
  pestanas: Pestana[];
  activa: number;
  children: React.ReactNode;
}) {
  return (
    // Fondo base carbón (no claro): al escalar, los bordes del encabezado
    // y de la barra de pestañas se suavizan contra este fondo, y uno
    // claro dejaba un hilo blanco pegado al marco.
    <div className="flex h-full flex-col bg-carbon font-sans text-carbon">
      <header className="bg-carbon px-5 pb-5 pt-[58px] text-yeso">
        <div className="flex items-center justify-between">
          <Logo variante="icono" tamano={12} />
          <span className="relative text-arena">
            <Bell size={20} strokeWidth={1.5} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 bg-oxido" />
          </span>
        </div>
        <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-oliva">{etiqueta}</p>
        <h1 className="mt-1.5 text-[28px] font-light leading-none tracking-[-0.01em]">{titulo}</h1>
        {extra}
      </header>

      <main className="flex-1 overflow-hidden bg-yeso-claro">{children}</main>

      <nav className="grid grid-cols-4 bg-carbon pb-[30px] pt-3">
        {pestanas.map(({ label, icono: Icono }, i) => (
          <span
            key={label}
            className={cn("flex flex-col items-center gap-1 text-[11px]", i === activa ? "text-oxido" : "text-oliva")}
          >
            <Icono size={22} strokeWidth={1.5} />
            {label}
          </span>
        ))}
      </nav>
    </div>
  );
}

// Logos de ejemplo de las empresas: iniciales sobre el color de cada una
// hasta tener los logos reales.
const EMPRESAS_DEMO = [
  { iniciales: "SA", logo: "bg-oxido text-white", rating: 4.6 },
  { iniciales: "MC", logo: "bg-tierra text-yeso", rating: 4.4 },
  { iniciales: "DB", logo: "bg-oliva text-carbon", rating: 4.1 },
];

export function MockInicio() {
  const { idioma, t } = useIdioma();
  const a = t.app;
  return (
    <PantallaApp
      etiqueta={a.inicio.etiqueta}
      titulo={a.inicio.titulo}
      pestanas={pestanas(ICONOS_COMPRADOR, a.pestanasComprador)}
      activa={0}
      extra={
        <div data-foco="ahorro" className="mt-5 flex items-center justify-between bg-carbon-800 px-4 py-3">
          <span>
            <span className="block text-[11px] uppercase tracking-[0.22em] text-oliva">{a.inicio.ahorro}</span>
            <span className="mt-1 block text-[22px] font-light leading-none text-yeso">{formatBs(AHORRO, idioma)}</span>
          </span>
          <ArrowUpRight size={20} strokeWidth={1.5} className="text-oxido" />
        </div>
      }
    >
      <div className="space-y-5 px-5 pt-4">
        <div data-foco="pedido-activo" className="border border-arena/70 bg-white px-4 py-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.22em] text-oliva-oscuro">{a.inicio.pedido}</span>
            <span className="flex items-center gap-1.5 text-[12px] text-oxido">
              <span className="h-1.5 w-1.5 animate-pulse bg-oxido" />
              {a.inicio.enCamino}
            </span>
          </div>
          <p className="mt-2 text-[15px] text-carbon">{a.inicio.llega}</p>
          <div className="mt-3 flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cn("h-1 flex-1", i < 3 ? "bg-oxido" : "bg-arena")} />
            ))}
          </div>
        </div>

        <div data-foco="empresas">
          <p className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-oliva-oscuro">
            {a.inicio.empresas}
            <span className="normal-case tracking-normal text-oxido">{a.inicio.verTodas}</span>
          </p>
          <div className="mt-2.5 divide-y divide-arena/60 border border-arena/70 bg-white">
            {PROVEEDORES.map((p, i) => (
              <div key={p.nombre} className="flex items-center gap-3 px-3.5 py-2.5">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center text-[13px] font-normal tracking-wider",
                    EMPRESAS_DEMO[i].logo,
                  )}
                >
                  {EMPRESAS_DEMO[i].iniciales}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] text-carbon">{p.nombre}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-oliva-oscuro">
                    <Star size={11} className="fill-oxido text-oxido" /> {EMPRESAS_DEMO[i].rating} · {p.distancia}
                  </p>
                </div>
                <span
                  className={cn(
                    "px-2 py-1 text-[11px]",
                    p.sinConfirmar ? "bg-yeso text-tierra" : "bg-oxido-claro text-oxido-oscuro",
                  )}
                >
                  {p.sinConfirmar ? a.inicio.sinConfirmar : a.inicio.conStock}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div data-foco="obras" className="grid grid-cols-2 gap-3">
          {a.inicio.obras.map((obra) => (
            <div key={obra.nombre} className="border border-arena/70 bg-white px-3.5 py-3">
              <Building2 size={18} strokeWidth={1.5} className="text-oliva-oscuro" />
              <p className="mt-2 truncate text-[14px] text-carbon">{obra.nombre}</p>
              <p className="mt-0.5 text-[12px] text-oliva-oscuro">{obra.detalle}</p>
            </div>
          ))}
        </div>
      </div>
    </PantallaApp>
  );
}

// Nombres en t.app.catalogo.productos (mismo orden).
const PRODUCTOS_DEMO = [
  { precio: "Bs 62", textura: "tex-concreto", proveedores: 3 },
  { precio: "Bs 48", textura: "tex-fierro", proveedores: 4 },
  { precio: "Bs 1.8", textura: "tex-ladrillo", proveedores: 2 },
  { precio: "Bs 320", textura: "tex-encofrado", proveedores: 3 },
  { precio: "Bs 180", textura: "tex-aridos", proveedores: 2 },
  { precio: "Bs 95", textura: "tex-tubos", proveedores: 3 },
];

export function MockCatalogo() {
  const a = useIdioma().t.app;
  return (
    <PantallaApp
      etiqueta={a.catalogo.etiqueta}
      titulo={a.catalogo.titulo}
      pestanas={pestanas(ICONOS_COMPRADOR, a.pestanasComprador)}
      activa={1}
      extra={
        <div data-foco="busqueda" className="mt-5 flex items-center gap-2.5 bg-carbon-800 px-4 py-3 text-[15px] text-oliva">
          <Search size={17} strokeWidth={1.75} />
          {a.catalogo.buscar}
        </div>
      }
    >
      <div data-foco="filtros" data-foco-interior className="flex gap-2 overflow-hidden px-5 pt-4">
        {a.catalogo.filtros.map((c, i) => (
          <span
            key={c}
            className={cn(
              "shrink-0 border px-3.5 py-1.5 text-[13px]",
              i === 0 ? "border-carbon bg-carbon text-yeso" : "border-arena text-tierra",
            )}
          >
            {c}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pt-4">
        {PRODUCTOS_DEMO.map((p, i) => (
          <div
            key={i}
            {...(i === 0 ? { "data-foco": "producto" } : {})}
            className={cn("overflow-hidden border bg-white", i === 0 ? "border-oxido/40" : "border-arena/70")}
          >
            <div className={cn("relative h-[72px]", p.textura)}>
              <span className="absolute left-2 top-2 bg-carbon/80 px-1.5 py-0.5 text-[10px] text-yeso">
                {a.catalogo.proveedores(p.proveedores)}
              </span>
            </div>
            <div className="px-3 py-2.5">
              <p className="truncate text-[14px] text-carbon">{a.catalogo.productos[i]}</p>
              <p className="mt-0.5 text-[12px] text-oliva-oscuro">
                {a.catalogo.desde} <span className="text-[14px] font-normal text-oxido">{p.precio}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </PantallaApp>
  );
}

const PEDIDO_DEMO = [
  {
    proveedor: "Ferretería San Antonio",
    items: [
      { producto: 0, cantidad: 5, precio: "Bs 310" },
      { producto: 1, cantidad: 10, precio: "Bs 480" },
    ],
  },
  {
    proveedor: "Materiales Cochabamba",
    items: [{ producto: 2, cantidad: 200, precio: "Bs 360" }],
  },
];

export function MockCarrito() {
  const { idioma, t } = useIdioma();
  const a = t.app;
  return (
    <PantallaApp
      etiqueta={a.carrito.etiqueta}
      titulo={a.carrito.titulo}
      pestanas={pestanas(ICONOS_COMPRADOR, a.pestanasComprador)}
      activa={2}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-5 px-5 pt-5">
          {PEDIDO_DEMO.map((grupo, g) => (
            <div key={grupo.proveedor} {...(g === 0 ? { "data-foco": "proveedor" } : {})}>
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-oliva-oscuro">
                <Store size={13} strokeWidth={1.75} />
                {grupo.proveedor}
              </p>
              <div className="mt-2.5 divide-y divide-arena/60 border border-arena/70 bg-white">
                {grupo.items.map((item, k) => (
                  <div key={item.producto} className="flex items-center gap-3 px-3.5 py-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-oxido-claro text-oxido">
                      <Package size={18} strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] text-carbon">{a.carrito.productos[item.producto]}</p>
                      <p className="mt-0.5 text-[13px] text-oliva-oscuro">{item.precio}</p>
                    </div>
                    <span
                      {...(g === 0 && k === 0 ? { "data-foco": "cantidad" } : {})}
                      className="flex items-center border border-arena text-tierra"
                    >
                      <Minus size={14} className="m-1.5" />
                      <span className="min-w-7 text-center text-[13px] tabular-nums">{item.cantidad}</span>
                      <Plus size={14} className="m-1.5" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div data-foco="entrega" className="flex items-center gap-3 border border-arena/70 bg-white px-3.5 py-3">
            <Truck size={18} strokeWidth={1.5} className="text-oliva-oscuro" />
            <div className="flex-1">
              <p className="text-[14px] text-carbon">{a.carrito.entrega}</p>
              <p className="text-[12px] text-oliva-oscuro">{a.carrito.entregaDetalle}</p>
            </div>
            <ChevronRight size={16} className="text-oliva" />
          </div>
        </div>

        <div data-foco="total" data-foco-interior className="border-t border-arena bg-white px-5 pb-5 pt-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[14px] text-tierra">{a.carrito.total}</span>
            <span className="text-[24px] font-light tabular-nums text-carbon">{formatBs(1150, idioma)}</span>
          </div>
          <div className="mt-3.5 bg-oxido py-3.5 text-center text-[13px] font-normal uppercase tracking-[0.18em] text-white">
            {a.carrito.confirmar}
          </div>
        </div>
      </div>
    </PantallaApp>
  );
}

export function MockSeguimiento() {
  const a = useIdioma().t.app;
  const pasos = [
    { hora: "08:02", hecho: true },
    { hora: "08:15", hecho: true },
    { hora: "08:40", hecho: true },
    { hora: "—", hecho: false },
  ];
  return (
    <PantallaApp
      etiqueta={a.seguimiento.etiqueta}
      titulo={a.seguimiento.titulo}
      pestanas={pestanas(ICONOS_COMPRADOR, a.pestanasComprador)}
      activa={2}
    >
      <div data-foco="mapa" className="relative h-[268px] overflow-hidden bg-yeso">
        <svg viewBox="0 0 393 268" className="absolute inset-0 h-full w-full" aria-hidden>
          <g stroke="var(--color-arena)" strokeOpacity="0.55" strokeWidth="14" fill="none">
            <path d="M-10 60 H410" />
            <path d="M-10 190 H410" />
            <path d="M90 -10 V280" />
            <path d="M290 -10 V280" />
          </g>
          <g stroke="var(--color-arena)" strokeOpacity="0.35" strokeWidth="6" fill="none">
            <path d="M-10 125 H410" />
            <path d="M190 -10 V280" />
          </g>
          <path d="M90 230 V190 H190 V60 H290 V40" stroke="var(--color-oxido)" strokeWidth="4" fill="none" strokeLinecap="square" />
        </svg>
        <span className="absolute left-[78px] top-[218px] h-6 w-6 border-[5px] border-carbon bg-yeso" />
        <span className="absolute left-[274px] top-[14px] flex flex-col items-center text-carbon">
          <MapPin size={30} strokeWidth={1.75} className="fill-yeso" />
        </span>
        <span
          className="absolute left-[164px] top-[96px] flex h-[52px] w-[52px] items-center justify-center bg-oxido text-white shadow-[0_10px_24px_-8px_rgb(194_65_12/0.7)]"
        >
          <Truck size={24} strokeWidth={1.75} />
        </span>
      </div>

      <div data-foco="llegada" className="relative mx-5 -mt-6 border border-arena/70 bg-white px-4 py-3.5 shadow-[0_12px_30px_-18px_rgb(36_34_32/0.5)]">
        <p className="text-[11px] uppercase tracking-[0.22em] text-oliva-oscuro">{a.seguimiento.llegaEn}</p>
        <p className="mt-1 text-[26px] font-light leading-none text-carbon">25 min</p>
        <p className="mt-2 text-[13px] text-tierra">{a.seguimiento.vehiculo}</p>
      </div>

      <div data-foco="estados" data-foco-interior className="space-y-3.5 px-5 pt-5">
        {pasos.map((paso, i) => (
          <div key={i} className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center",
                paso.hecho ? "bg-oxido text-white" : "border border-arena bg-white",
              )}
            >
              {paso.hecho && <Check size={12} strokeWidth={2.5} />}
            </span>
            <span className={cn("flex-1 text-[15px]", paso.hecho ? "text-carbon" : "text-oliva")}>{a.seguimiento.estados[i]}</span>
            <span className="text-[13px] tabular-nums text-oliva-oscuro">{paso.hora}</span>
          </div>
        ))}
      </div>
    </PantallaApp>
  );
}

export function MockDashboard() {
  const a = useIdioma().t.app;
  const ventas = [38, 52, 44, 70, 58, 86, 64];
  return (
    <PantallaApp
      etiqueta="Ferretería San Antonio"
      titulo={a.panel.titulo}
      pestanas={pestanas(ICONOS_FERRETERIA, a.pestanasFerreteria)}
      activa={0}
    >
      <div data-foco="resumen" data-foco-interior className="grid grid-cols-3 gap-2.5 px-5 pt-5">
        {[
          { label: a.panel.stats[0], valor: "128" },
          { label: a.panel.stats[1], valor: "6", destacado: true },
          { label: a.panel.stats[2], valor: "Bs 24k" },
        ].map((stat) => (
          <div key={stat.label} className="border border-arena/70 bg-white px-3 py-3">
            <p className={cn("text-[22px] font-light leading-none", stat.destacado ? "text-oxido" : "text-carbon")}>
              {stat.valor}
            </p>
            <p className="mt-1.5 text-[11px] text-oliva-oscuro">{stat.label}</p>
          </div>
        ))}
      </div>

      <div data-foco="semana" className="mx-5 mt-3 border border-arena/70 bg-white px-4 pb-3 pt-3.5">
        <p className="text-[11px] uppercase tracking-[0.22em] text-oliva-oscuro">{a.panel.semana}</p>
        <div className="mt-3 flex h-[84px] items-end gap-2.5">
          {ventas.map((v, i) => (
            <span
              key={i}
              className={cn("flex-1", i === 5 ? "bg-oxido" : "bg-arena")}
              style={{ height: `${v}%` }}
            />
          ))}
        </div>
      </div>

      <p className="px-5 pt-5 text-[11px] uppercase tracking-[0.22em] text-oliva-oscuro">{a.panel.entrantes}</p>
      <div data-foco="entrantes" className="mx-5 mt-2.5 divide-y divide-arena/60 border border-arena/70 bg-white">
        {a.panel.pedidos.map((p, i) => (
          <div key={p.obra} className="flex items-center gap-3 px-3.5 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] text-carbon">{p.obra}</p>
              <p className="mt-0.5 text-[12px] text-oliva-oscuro">{p.detalle}</p>
            </div>
            <span
              className={cn(
                "px-2 py-1 text-[11px]",
                i < 2 ? "bg-oxido-claro text-oxido-oscuro" : "bg-yeso text-tierra",
              )}
            >
              {i < 2 ? a.panel.nuevo : a.panel.preparando}
            </span>
          </div>
        ))}
      </div>
    </PantallaApp>
  );
}

export function MockFletes() {
  const a = useIdioma().t.app;
  const fletes = [
    { origen: "Ferretería San Antonio", destino: "Torre del Bosque", distancia: "2.1 km", rating: 4.6, carga: a.fletes.cargas[0] },
    { origen: "Materiales Cochabamba", destino: "Casa Sacaba #12", distancia: "3.8 km", rating: 4.4, carga: a.fletes.cargas[1] },
  ];
  return (
    <PantallaApp
      etiqueta={a.fletes.etiqueta}
      titulo={a.fletes.titulo}
      pestanas={pestanas(ICONOS_CHOFER, a.pestanasChofer)}
      activa={0}
      extra={
        <div data-foco="disponible" className="mt-5 flex items-center justify-between bg-carbon-800 px-4 py-3">
          <span className="flex items-center gap-2.5 text-[14px] text-yeso">
            <span className="h-2 w-2 bg-oxido" />
            {a.fletes.disponible}
          </span>
          <span className="flex h-6 w-11 items-center justify-end bg-oxido p-0.5">
            <span className="h-5 w-5 bg-white" />
          </span>
        </div>
      }
    >
      <div className="space-y-3.5 px-5 pt-5">
        {fletes.map((flete, i) => (
          <div key={flete.origen} className="border border-arena/70 bg-white p-4">
            <div {...(i === 0 ? { "data-foco": "ruta" } : {})} className="flex items-start gap-3">
              <div className="flex flex-col items-center pt-1">
                <span className="h-2.5 w-2.5 border-2 border-carbon" />
                <span className="my-1 h-6 w-px bg-arena" />
                <MapPin size={14} strokeWidth={2} className="text-oxido" />
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <p className="truncate text-[15px] text-carbon">{flete.origen}</p>
                <p className="truncate text-[15px] text-carbon">{flete.destino}</p>
              </div>
            </div>
            <div className="mt-3.5 flex items-center gap-3 text-[12px] text-oliva-oscuro">
              <span>{flete.distancia}</span>
              <span className="flex items-center gap-1">
                <Star size={12} className="fill-oxido text-oxido" /> {flete.rating}
              </span>
              <span className="truncate">{flete.carga}</span>
            </div>
            <div
              {...(i === 0 ? { "data-foco": "aceptar" } : {})}
              className={cn(
                "mt-4 py-3 text-center text-[13px] font-normal uppercase tracking-[0.18em]",
                i === 0 ? "bg-carbon text-yeso" : "border border-carbon text-carbon",
              )}
            >
              {a.fletes.aceptar}
            </div>
          </div>
        ))}
      </div>
    </PantallaApp>
  );
}
