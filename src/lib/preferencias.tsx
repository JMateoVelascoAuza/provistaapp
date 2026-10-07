"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { TEXTOS, type Textos } from "@/lib/textos";

export type Idioma = "es" | "en";
export type Tema = "oscuro" | "claro";

const CLAVE_IDIOMA = "entreobra-idioma";
const CLAVE_TEMA = "entreobra-tema";
const EVENTO = "entreobra:preferencias";

export const SCRIPT_PREFERENCIAS = `(function(){var d=document.documentElement,p=window.__ENTREOBRA_PREFS||{},t=p.tema,i=p.idioma;try{t=t||localStorage.getItem("${CLAVE_TEMA}");i=i||localStorage.getItem("${CLAVE_IDIOMA}")}catch(e){}if(t==="claro")d.setAttribute("data-tema","claro");if(i==="en"){d.setAttribute("data-idioma","en");d.setAttribute("data-idioma-pendiente","");d.lang="en";setTimeout(function(){d.removeAttribute("data-idioma-pendiente")},1500)}})();`;

type Contexto = {
  idioma: Idioma;
  tema: Tema;
  setIdioma: (idioma: Idioma) => void;
  setTema: (tema: Tema) => void;
};

const PreferenciasContext = createContext<Contexto>({
  idioma: "es",
  tema: "oscuro",
  setIdioma: () => {},
  setTema: () => {},
});

function guardar(clave: string, valor: string) {
  try {
    localStorage.setItem(clave, valor);
  } catch {
  }
}

export function PreferenciasProvider({ children }: { children: React.ReactNode }) {
  const [idioma, setIdiomaEstado] = useState<Idioma>("es");
  const [tema, setTemaEstado] = useState<Tema>("oscuro");
  const pathname = usePathname();

  useEffect(() => {
    const d = document.documentElement;
    if (d.getAttribute("data-idioma") === "en") setIdiomaEstado("en");
    if (d.getAttribute("data-tema") === "claro") setTemaEstado("claro");

    const alRecibir = (e: Event) => {
      const detalle = (e as CustomEvent<{ idioma?: Idioma; tema?: Tema }>).detail ?? {};
      if (detalle.idioma) setIdiomaEstado(detalle.idioma);
      if (detalle.tema) setTemaEstado(detalle.tema);
    };
    window.addEventListener(EVENTO, alRecibir);
    return () => window.removeEventListener(EVENTO, alRecibir);
  }, []);

  useEffect(() => {
    const d = document.documentElement;
    d.lang = idioma;
    d.setAttribute("data-idioma", idioma);
    d.removeAttribute("data-idioma-pendiente");
    const t = TEXTOS[idioma].meta;
    const esDemo = pathname?.startsWith("/demo") || !!document.querySelector("[data-pagina=\"demo\"]");
    const propio = document.querySelector("[data-titulo-pagina]")?.getAttribute("data-titulo-pagina");
    const titulo = propio || (esDemo ? t.tituloDemo : t.tituloLanding);
    document.title = titulo;
    const observador = new MutationObserver(() => {
      if (document.title !== titulo) document.title = titulo;
    });
    observador.observe(document.head, { subtree: true, childList: true, characterData: true });
    return () => observador.disconnect();
  }, [idioma, pathname]);

  useEffect(() => {
    const d = document.documentElement;
    if (tema === "claro") d.setAttribute("data-tema", "claro");
    else d.removeAttribute("data-tema");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", tema === "claro" ? "#f2efea" : "#242220");
  }, [tema]);

  const setIdioma = useCallback((nuevo: Idioma) => {
    setIdiomaEstado(nuevo);
    guardar(CLAVE_IDIOMA, nuevo);
  }, []);

  const setTema = useCallback((nuevo: Tema) => {
    setTemaEstado(nuevo);
    guardar(CLAVE_TEMA, nuevo);
  }, []);

  const valor = useMemo(() => ({ idioma, tema, setIdioma, setTema }), [idioma, tema, setIdioma, setTema]);
  return <PreferenciasContext.Provider value={valor}>{children}</PreferenciasContext.Provider>;
}

export function useIdioma(): { idioma: Idioma; setIdioma: (i: Idioma) => void; t: Textos } {
  const { idioma, setIdioma } = useContext(PreferenciasContext);
  return { idioma, setIdioma, t: TEXTOS[idioma] };
}

export function useTema() {
  const { tema, setTema } = useContext(PreferenciasContext);
  return { tema, setTema };
}
