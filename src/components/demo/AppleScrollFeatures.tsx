"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ANCHO_APP, CAPA_APP, PhoneFrame } from "./PhoneFrame";
import { MockCarrito, MockCatalogo, MockDashboard, MockFletes, MockInicio, MockSeguimiento } from "./MockScreens";
import { useIdioma } from "@/lib/preferencias";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type Foco = { id: string; titulo: string; texto: string };

const BASE: { Pantalla: () => React.ReactNode; focos: string[] }[] = [
  { Pantalla: MockInicio, focos: ["ahorro", "pedido-activo", "empresas", "obras"] },
  { Pantalla: MockCatalogo, focos: ["busqueda", "filtros", "producto"] },
  { Pantalla: MockCarrito, focos: ["proveedor", "cantidad", "entrega", "total"] },
  { Pantalla: MockSeguimiento, focos: ["mapa", "llegada", "estados"] },
  { Pantalla: MockDashboard, focos: ["resumen", "semana", "entrantes"] },
  { Pantalla: MockFletes, focos: ["disponible", "ruta", "aceptar"] },
];

function usePasos(): { titulo: string; descripcion: string; Pantalla: () => React.ReactNode; focos: Foco[] }[] {
  const { t } = useIdioma();
  return BASE.map((base, i) => ({
    Pantalla: base.Pantalla,
    titulo: t.demo.pasos[i].titulo,
    descripcion: t.demo.pasos[i].descripcion,
    focos: base.focos.map((id, j) => ({ id, ...t.demo.pasos[i].focos[j] })),
  }));
}

const ASPECTO_TELEFONO = 2.069;
const DESKTOP = 1024;
const ZOOM_MIN = 1.6;
const ZOOM_MAX = 4.2;
const AIRE = 0.9;
const SCROLL_POR_UNIDAD = 0.3;

function anchoTelefono() {
  const alto = window.innerHeight;
  if (window.innerWidth >= DESKTOP) return Math.round(Math.min(310, Math.max(220, ((alto - 72) * 0.72) / ASPECTO_TELEFONO)));
  return Math.round(Math.min(250, window.innerWidth * 0.6, Math.max(160, ((alto - 64) * 0.52) / ASPECTO_TELEFONO)));
}

function offsetHasta(el: HTMLElement, ancestro: HTMLElement) {
  let x = 0;
  let y = 0;
  let nodo: HTMLElement | null = el;
  while (nodo && nodo !== ancestro) {
    x += nodo.offsetLeft;
    y += nodo.offsetTop;
    nodo = nodo.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

function rectEnApp(el: HTMLElement, app: HTMLElement) {
  const { x, y } = offsetHasta(el, app);
  let rect = { x, y, w: el.offsetWidth, h: el.offsetHeight };
  if (el.hasAttribute("data-foco-interior")) {
    const cs = getComputedStyle(el);
    const [pl, pr, pt, pb] = [cs.paddingLeft, cs.paddingRight, cs.paddingTop, cs.paddingBottom].map(parseFloat);
    rect = { x: x + pl, y: y + pt, w: rect.w - pl - pr, h: rect.h - pt - pb };
  }
  const margen = 8;
  return { x: rect.x - margen, y: rect.y - margen, w: rect.w + margen * 2, h: rect.h + margen * 2 };
}

function RecorridoAnimado() {
  const escenaRef = useRef<HTMLDivElement>(null);
  const objetivoRef = useRef<HTMLDivElement>(null);
  const telefonoRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const anilloRef = useRef<HTMLDivElement>(null);
  const veloRef = useRef<HTMLDivElement>(null);
  const avisoRef = useRef<HTMLParagraphElement>(null);
  const listaRef = useRef<HTMLDivElement>(null);
  const pasoMovilRef = useRef<HTMLDivElement>(null);
  const barraRef = useRef<HTMLDivElement>(null);
  const pantallasRef = useRef<Array<HTMLDivElement | null>>([]);
  const notasRef = useRef<Array<HTMLDivElement | null>>([]);
  const navRef = useRef<{ st: ScrollTrigger; inicios: number[]; duracion: number } | null>(null);
  const [activo, setActivo] = useState(0);
  const PASOS = usePasos();
  const { idioma, t } = useIdioma();
  const [vista, setVista] = useState({ ancho: 260, version: 0 });

  useEffect(() => {
    let ancho = window.innerWidth;
    let alto = window.innerHeight;
    let espera: number | undefined;
    const aplicar = () => setVista((v) => ({ ancho: anchoTelefono(), version: v.version + 1 }));
    const inicial = requestAnimationFrame(aplicar);
    const alCambiar = () => {
      window.clearTimeout(espera);
      espera = window.setTimeout(() => {
        const cambioAncho = window.innerWidth !== ancho;
        const cambioAlto = window.innerHeight !== alto && window.innerWidth >= DESKTOP;
        ancho = window.innerWidth;
        alto = window.innerHeight;
        if (cambioAncho || cambioAlto) aplicar();
      }, 200);
    };
    window.addEventListener("resize", alCambiar);
    return () => {
      cancelAnimationFrame(inicial);
      window.clearTimeout(espera);
      window.removeEventListener("resize", alCambiar);
    };
  }, []);

  useGSAP(
    () => {
      const escena = escenaRef.current;
      const objetivo = objetivoRef.current;
      const telefono = telefonoRef.current;
      const app = appRef.current;
      const anillo = anilloRef.current;
      if (!escena || !objetivo || !telefono || !app || !anillo) return;
      const pantallas = pantallasRef.current as HTMLDivElement[];
      const notas = notasRef.current as HTMLDivElement[];
      const textoNormal = [listaRef.current, pasoMovilRef.current, avisoRef.current].filter(Boolean) as HTMLElement[];

      const tel = offsetHasta(telefono, escena);
      const anchoTel = telefono.offsetWidth;
      const altoTel = telefono.offsetHeight;
      const escalaApp = (anchoTel * CAPA_APP.width) / ANCHO_APP;
      const pantallaX = anchoTel * CAPA_APP.left;
      const pantallaY = altoTel * CAPA_APP.top;
      const obj = offsetHasta(objetivo, escena);
      const objW = objetivo.offsetWidth;
      const objH = objetivo.offsetHeight;

      const geometria = PASOS.map((paso, i) =>
        paso.focos.map((foco) => {
          const el = pantallas[i].querySelector<HTMLElement>(`[data-foco="${foco.id}"]`);
          const r = el ? rectEnApp(el, app) : { x: 0, y: 0, w: ANCHO_APP, h: 200 };
          const ajuste = AIRE * Math.min(objW / (r.w * escalaApp), objH / (r.h * escalaApp));
          const k = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, ajuste));
          const cx = pantallaX + (r.x + r.w / 2) * escalaApp;
          const cy = pantallaY + (r.y + r.h / 2) * escalaApp;
          return {
            x: obj.x + objW / 2 - tel.x - k * cx,
            y: obj.y + objH / 2 - tel.y - k * cy,
            k,
            anillo: { x: r.x, y: r.y, width: r.w, height: r.h },
          };
        }),
      );

      gsap.set(telefono, { transformOrigin: "0 0" });
      gsap.set(notas, { y: 20 });

      const inicios: number[] = [];
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onUpdate: () => {
          const t = tl.time();
          let idx = 0;
          inicios.forEach((inicio, i) => {
            if (t >= inicio + 0.25) idx = i;
          });
          setActivo(idx);
          if (barraRef.current) gsap.set(barraRef.current, { scaleX: tl.progress() });
        },
      });

      let nota = 0;
      PASOS.forEach((paso, i) => {
        if (i === 0) {
          inicios.push(0);
        } else {
          const t = tl.duration();
          inicios.push(t);
          tl.to(pantallas[i - 1], { opacity: 0, duration: 0.5 }, t);
          tl.to(pantallas[i], { opacity: 1, duration: 0.5 }, t);
        }
        tl.to({}, { duration: 0.4 });

        paso.focos.forEach((_, j) => {
          const g = geometria[i][j];
          const t = tl.duration();
          const dur = j === 0 ? 1.1 : 0.8;
          tl.to(
            telefono,
            { x: g.x, y: g.y, scale: g.k, duration: dur, ease: j === 0 ? "power3.inOut" : "power2.inOut", force3D: false },
            t,
          );
          if (j === 0) {
            tl.to(textoNormal, { opacity: 0, duration: 0.4 }, t);
            tl.to(veloRef.current, { opacity: 1, duration: 0.6 }, t + 0.3);
            tl.set(anillo, g.anillo, t);
            tl.to(anillo, { opacity: 1, duration: 0.4 }, t + dur - 0.3);
          } else {
            tl.to(anillo, { ...g.anillo, duration: dur }, t);
            tl.to(notas[nota - 1], { opacity: 0, y: -16, duration: 0.3 }, t);
          }
          tl.to(notas[nota], { opacity: 1, y: 0, duration: 0.4 }, t + dur - 0.3);
          nota++;
          tl.to({}, { duration: 0.7 });
        });

        const t = tl.duration();
        tl.to(telefono, { x: 0, y: 0, scale: 1, duration: 1, ease: "power3.inOut", force3D: false }, t);
        tl.to(notas[nota - 1], { opacity: 0, y: -16, duration: 0.3 }, t);
        tl.to(anillo, { opacity: 0, duration: 0.3 }, t);
        tl.to(veloRef.current, { opacity: 0, duration: 0.5 }, t + 0.3);
        tl.to(textoNormal, { opacity: 1, duration: 0.4 }, t + 0.6);
        tl.to({}, { duration: 0.4 });
      });

      const duracion = tl.duration();
      const st = ScrollTrigger.create({
        animation: tl,
        trigger: escena,
        start: "top top",
        end: () => `+=${duracion * window.innerHeight * SCROLL_POR_UNIDAD}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
      navRef.current = { st, inicios, duracion };
      ScrollTrigger.refresh();

      return () => {
        navRef.current = null;
      };
    },
    { scope: escenaRef, dependencies: [vista, idioma], revertOnUpdate: true },
  );

  function irAlPaso(i: number) {
    const nav = navRef.current;
    if (!nav) return;
    const tiempo = i === 0 ? 0 : nav.inicios[i] + 0.55;
    const destino = nav.st.start + ((nav.st.end - nav.st.start) * tiempo) / nav.duracion;
    window.scrollTo({ top: destino, behavior: "smooth" });
  }

  let indiceNota = 0;

  return (
    <div>
      <div
        ref={escenaRef}
        className="relative h-svh overflow-hidden bg-yeso"
        style={{ "--ancho": String(vista.ancho) } as React.CSSProperties}
      >
        <div
          ref={objetivoRef}
          aria-hidden
          className="pointer-events-none invisible absolute inset-x-[5%] bottom-[44%] top-[13%] lg:bottom-[9%] lg:left-[48%] lg:right-[3%] lg:top-[16%]"
        />

        <div className="contenedor relative flex h-full flex-col pt-16 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:pt-[72px]">
          <div className="relative z-0 flex flex-1 flex-col items-center justify-center lg:order-2">
            <div ref={telefonoRef}>
              <PhoneFrame className="">
                <div ref={appRef} className="relative h-full w-full">
                  {PASOS.map(({ Pantalla }, i) => (
                    <div
                      key={i}
                      ref={(el) => {
                        pantallasRef.current[i] = el;
                      }}
                      className={cn("absolute inset-0", i > 0 && "opacity-0")}
                    >
                      <Pantalla />
                    </div>
                  ))}
                  <div
                    ref={anilloRef}
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 border-2 border-oxido opacity-0 shadow-[0_0_0_2000px_rgb(36_34_32/0.38)]"
                  />
                </div>
              </PhoneFrame>
            </div>
            <p ref={avisoRef} className="mt-4 max-w-[17rem] text-center text-[11px] leading-snug text-oliva-oscuro lg:mt-6 lg:text-xs">
              {t.demo.notaTelefono}
            </p>
          </div>

          <div className="relative z-20 h-[40%] shrink-0 lg:order-1 lg:h-auto">
            <div ref={listaRef} className="hidden h-full flex-col justify-center lg:flex">
              <p className="etiqueta text-oliva-oscuro">{t.demo.appPorDentro}</p>
              <div className="mt-8 flex flex-col">
                {PASOS.map((paso, i) => (
                  <button
                    key={i}
                    onClick={() => irAlPaso(i)}
                    className="group flex flex-col items-start border-t border-arena py-5 text-left first:border-t-0"
                  >
                    <span
                      className={cn(
                        "text-[11px] tracking-[0.3em] transition-colors duration-500",
                        i === activo ? "text-oxido" : "text-oliva-oscuro group-hover:text-tierra",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "mt-2 text-[1.35rem] font-light transition-colors duration-500",
                        i === activo ? "text-carbon" : "text-oliva-oscuro",
                      )}
                    >
                      {paso.titulo}
                    </span>
                    <span
                      className={cn(
                        "mt-1.5 max-w-sm text-sm leading-relaxed text-tierra/75 transition-all duration-500",
                        i === activo ? "max-h-20 opacity-100" : "max-h-0 overflow-hidden opacity-0",
                      )}
                    >
                      {paso.descripcion}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div ref={pasoMovilRef} className="relative h-full lg:hidden">
              {PASOS.map((paso, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute inset-x-0 top-4 transition-opacity duration-500",
                    i === activo ? "opacity-100" : "opacity-0",
                  )}
                >
                  <p className="etiqueta text-oxido">
                    {String(i + 1).padStart(2, "0")} / {String(PASOS.length).padStart(2, "0")}
                  </p>
                  <p className="titulo mt-3 text-[1.6rem] text-carbon">{paso.titulo}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-tierra/75">{paso.descripcion}</p>
                </div>
              ))}
            </div>

            {PASOS.map((paso, i) =>
              paso.focos.map((foco, j) => {
                const indice = indiceNota++;
                return (
                  <div
                    key={foco.id}
                    ref={(el) => {
                      notasRef.current[indice] = el;
                    }}
                    className="pointer-events-none absolute inset-x-0 top-4 opacity-0 lg:inset-y-0 lg:top-0 lg:flex lg:items-center"
                  >
                    <div className="max-w-md lg:max-w-[23rem]">
                      <p className="etiqueta text-oxido">
                        {String(i + 1).padStart(2, "0")} · {paso.titulo}
                      </p>
                      <p className="titulo mt-3 text-[1.6rem] text-carbon lg:mt-5 lg:text-[2.75rem]">{foco.titulo}</p>
                      <p className="mt-2 text-[15px] leading-relaxed text-tierra/80 lg:mt-5 lg:text-[17px]">{foco.texto}</p>
                      <div className="mt-4 flex gap-1.5 lg:mt-8">
                        {paso.focos.map((f, k) => (
                          <span key={f.id} className={cn("h-0.5 w-6", k === j ? "bg-oxido" : "bg-arena")} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }),
            )}
          </div>
        </div>

        <div
          ref={veloRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[45%] bg-linear-to-t from-yeso from-75% to-transparent opacity-0 lg:inset-y-0 lg:left-0 lg:right-auto lg:h-auto lg:w-[47%] lg:bg-linear-to-r lg:from-[86%]"
        />

        <div className="absolute inset-x-0 bottom-0 z-30 h-px bg-arena">
          <div ref={barraRef} className="h-full origin-left scale-x-0 bg-oxido" />
        </div>
      </div>
    </div>
  );
}

function RecorridoEstatico() {
  const PASOS = usePasos();
  const { t } = useIdioma();
  return (
    <div className="bg-yeso py-20">
      <div className="contenedor flex flex-col gap-24">
        {PASOS.map(({ titulo, descripcion, Pantalla, focos }, i) => (
          <div key={titulo} className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="etiqueta text-oxido">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="titulo mt-3 text-[2rem] text-carbon">{titulo}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-tierra/75">{descripcion}</p>
              <ul className="mt-8 space-y-5">
                {focos.map((foco) => (
                  <li key={foco.id} className="border-t border-arena pt-4">
                    <p className="text-[17px] text-carbon">{foco.titulo}</p>
                    <p className="mt-1 text-sm leading-relaxed text-tierra/75">{foco.texto}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <PhoneFrame className="[--ancho:220] md:[--ancho:280]">
                <Pantalla />
              </PhoneFrame>
              <p className="mt-5 max-w-[17rem] text-center text-xs leading-snug text-oliva-oscuro">
                {t.demo.notaTelefono}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AppleScrollFeatures() {
  const reducido = usePrefersReducedMotion();
  return reducido ? <RecorridoEstatico /> : <RecorridoAnimado />;
}
