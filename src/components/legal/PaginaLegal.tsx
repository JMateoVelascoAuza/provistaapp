"use client";

import { Fragment, type ReactNode } from "react";
import { Footer } from "@/components/sections/Footer";
import { Enlace } from "@/components/ui/Enlace";
import { NEGOCIO, WHATSAPP_ENTREOBRA } from "@/lib/datos";
import { LEGAL, RUTAS_LEGALES, type DocumentoLegal } from "@/lib/legal";
import { useIdioma } from "@/lib/preferencias";
import { cn } from "@/lib/utils";

const ENLACE = "text-carbon underline decoration-arena underline-offset-4 transition-colors hover:decoration-oxido";
const DOCUMENTOS = Object.keys(RUTAS_LEGALES) as DocumentoLegal[];

function conEnlaces(texto: string, idioma: "es" | "en"): ReactNode[] {
  const l = LEGAL[idioma];
  return texto.split(/(\{[a-z]+\})/).map((parte, i) => {
    const clave = parte.slice(1, -1);
    if (clave === "correo") return <a key={i} href={`mailto:${NEGOCIO.correo}`} className={ENLACE}>{NEGOCIO.correo}</a>;
    if (clave === "contacto") {
      const conectores = idioma === "es" ? ["a ", " o por WhatsApp al ", "por WhatsApp al "] : ["at ", " or on WhatsApp at ", "on WhatsApp at "];
      return NEGOCIO.correo ? (
        <Fragment key={i}>{conEnlaces(`${conectores[0]}{correo}${conectores[1]}{whatsapp}`, idioma)}</Fragment>
      ) : (
        <Fragment key={i}>{conEnlaces(`${conectores[2]}{whatsapp}`, idioma)}</Fragment>
      );
    }
    if (clave === "whatsapp")
      return <a key={i} href={`https://wa.me/${WHATSAPP_ENTREOBRA}`} target="_blank" rel="noopener noreferrer" className={ENLACE}>{NEGOCIO.whatsapp}</a>;
    if (clave in RUTAS_LEGALES) {
      const doc = clave as DocumentoLegal;
      return <Enlace key={i} href={RUTAS_LEGALES[doc]} className={ENLACE}>{l.documentos[doc].titulo}</Enlace>;
    }
    return <Fragment key={i}>{parte}</Fragment>;
  });
}

export function PaginaLegal({ documento }: { documento: DocumentoLegal }) {
  const { idioma } = useIdioma();
  const l = LEGAL[idioma];
  const doc = l.documentos[documento];

  const datosNegocio = [
    [l.responsable, NEGOCIO.razonSocial || NEGOCIO.nombreComercial],
    [l.nit, NEGOCIO.nit],
    [l.matricula, NEGOCIO.matricula],
    [l.direccion, [NEGOCIO.direccion, NEGOCIO.ciudad].filter(Boolean).join(", ")],
  ].filter(([, valor]) => valor);

  return (
    <>
      <main id="contenido" data-pagina="legal" data-titulo-pagina={doc.tituloPestana}>
        <section data-zona="oscura" className="tex-plano relative overflow-hidden bg-carbon py-24 md:py-28">
          <div className="contenedor max-w-3xl">
            <p className="etiqueta text-oliva">{l.etiqueta}</p>
            <h1 className="titulo mt-5 text-[2.25rem] text-yeso sm:text-5xl">{doc.titulo}</h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-arena/80 md:text-base">{doc.bajada}</p>
            <p className="mt-8 text-[13px] text-oliva">
              {l.actualizado}: <time dateTime="2026-10-04">{l.fecha}</time>
            </p>
          </div>
        </section>

        <div data-zona="funcional" className="bg-yeso py-16 md:py-20">
          <div className="contenedor max-w-3xl">
            <nav aria-label={l.navDocumentos} className="flex flex-wrap gap-x-6 gap-y-2 border-b border-arena pb-6 text-[13px]">
              {DOCUMENTOS.map((d) => (
                <Enlace
                  key={d}
                  href={RUTAS_LEGALES[d]}
                  aria-current={d === documento ? "page" : undefined}
                  className={cn(
                    "py-1 underline-offset-4 transition-colors",
                    d === documento ? "text-carbon underline decoration-oxido" : "text-oliva-oscuro hover:text-carbon",
                  )}
                >
                  {l.documentos[d].titulo}
                </Enlace>
              ))}
            </nav>

            <div className="mt-12 flex flex-col gap-11">
              {doc.secciones.map((s) => (
                <section key={s.titulo}>
                  <h2 className="titulo text-[1.375rem] text-carbon md:text-2xl">{s.titulo}</h2>
                  <Cuerpo seccion={s} idioma={idioma} />
                </section>
              ))}
            </div>

            <dl className="mt-14 grid gap-x-8 gap-y-3 border-l-2 border-oxido bg-white/60 px-6 py-6 text-[14px] sm:grid-cols-[auto_1fr]">
              {datosNegocio.map(([etiqueta, valor]) => (
                <Fragment key={etiqueta}>
                  <dt className="text-oliva-oscuro">{etiqueta}</dt>
                  <dd className="text-carbon">{valor}</dd>
                </Fragment>
              ))}
              <dt className="text-oliva-oscuro">{l.contacto}</dt>
              <dd className="text-carbon">{conEnlaces(NEGOCIO.correo ? "{correo} · {whatsapp}" : "WhatsApp {whatsapp}", idioma)}</dd>
            </dl>
          </div>
        </div>
      </main>
      <Footer tono="claro" />
    </>
  );
}

function Cuerpo({ seccion, idioma }: { seccion: { parrafos?: string[]; lista?: string[] }; idioma: "es" | "en" }) {
  const parrafos = seccion.parrafos ?? [];
  const introduce = parrafos[0]?.trim().endsWith(":");
  const antes = introduce ? parrafos.slice(0, 1) : [];
  const despues = introduce ? parrafos.slice(1) : parrafos;
  const parrafo = "mt-4 text-[15px] leading-relaxed text-tierra";

  return (
    <>
      {antes.map((p) => (
        <p key={p} className={parrafo}>{conEnlaces(p, idioma)}</p>
      ))}
      {seccion.lista && (
        <ul className="mt-4 flex flex-col gap-3">
          {seccion.lista.map((item) => (
            <li key={item} className="relative pl-5 text-[15px] leading-relaxed text-tierra">
              <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-px w-2.5 bg-oxido" />
              {conEnlaces(item, idioma)}
            </li>
          ))}
        </ul>
      )}
      {despues.map((p) => (
        <p key={p} className={parrafo}>{conEnlaces(p, idioma)}</p>
      ))}
    </>
  );
}
