"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { TEXTOS, type Textos } from "@/lib/textos";

export type Idioma = "es" | "en";
export type Tema = "oscuro" | "claro";

const CLAVE_IDIOMA = "entreobra-idioma";
const CLAVE_TEMA = "entreobra-tema";
const EVENTO = "entreobra:preferencias";

/**
 * Corre en el <head> antes de pintar: aplica el tema y el idioma
 * guardados para que no haya parpadeo. Si el idioma guardado es inglés,
 * oculta la página hasta que React cambie los textos (con un tope de
 * 1,5 s por si el JS no llega a correr). `__ENTREOBRA_PREFS` lo usa la
 * versión de un solo archivo, donde la demo no tiene acceso al almacenamiento.
 */
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
    // Sin almacenamiento (modo privado, archivo incrustado): la elección
    // dura lo que dure la página.
  }
}

export function PreferenciasProvider({ children }: { children: React.ReactNode }) {
  const [idioma, setIdiomaEstado] = useState<Idioma>("es");
  const [tema, setTemaEstado] = useState<Tema>("oscuro");
  const pathname = usePathname();

  // Toma lo que dejó aplicado el script del <head>.
  useEffect(() => {
    const d = document.documentElement;
    /* eslint-disable react-hooks/set-state-in-effect */
    if (d.getAttribute("data-idioma") === "en") setIdiomaEstado("en");
    if (d.getAttribute("data-tema") === "claro") setTemaEstado("claro");
    /* eslint-enable react-hooks/set-state-in-effect */

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
    // La demo también puede abrirse incrustada (sin "/demo" en la URL).
    const esDemo = pathname?.startsWith("/demo") || !!document.querySelector("[data-pagina=\"demo\"]");
    const titulo = esDemo ? t.tituloDemo : t.tituloLanding;
    document.title = titulo;
    // Next vuelve a escribir el <title> de los metadatos (en español)
    // después de hidratar: se corrige cada vez que cambie.
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
