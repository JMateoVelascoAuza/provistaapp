"use client";

import { useEffect, useState } from "react";
import { Monograma } from "@/components/ui/Logo";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { WHATSAPP_ENTREOBRA } from "@/lib/datos";
import { APPS_SCRIPT_URL, ES_EXPORT_ESTATICO, SIN_SERVIDOR } from "@/lib/enlace";
import { useIdioma } from "@/lib/preferencias";
import type { Textos } from "@/lib/textos";
import { escucharTipoUsuario, type TipoUsuario } from "@/lib/tipoUsuario";
import { cn } from "@/lib/utils";

type Estado = "idle" | "enviando" | "enviado" | "error";

const OPCIONES: TipoUsuario[] = ["obra", "proveedor"];

function enlaceWhatsapp(t: Textos, nombre: string, tipo: TipoUsuario, whatsapp: string) {
  const texto = t.formulario.mensajeWa(nombre, t.formulario.opciones[tipo], whatsapp);
  return `https://wa.me/${WHATSAPP_ENTREOBRA}?text=${encodeURIComponent(texto)}`;
}

function nuevoIdEnvio() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

const CAMPO =
  "w-full border-0 border-b border-arena bg-transparent px-0 py-3 text-[15px] text-carbon outline-none transition-colors duration-300 placeholder:text-oliva focus:border-oxido focus-visible:outline-none";

export function Formulario() {
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("obra");
  const [estado, setEstado] = useState<Estado>("idle");
  const [error, setError] = useState<string | null>(null);
  const [enlaceWa, setEnlaceWa] = useState<string | null>(null);
  const { idioma, t } = useIdioma();

  // Los CTA de "Dos lados" llegan con el tipo ya elegido.
  useEffect(() => escucharTipoUsuario(setTipoUsuario), []);

  async function enviar(formData: FormData) {
    const nombre = String(formData.get("nombre") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const linkWhatsapp = enlaceWhatsapp(t, nombre, tipoUsuario, whatsapp);
    setError(null);
    setEnlaceWa(null);

    // Sin servidor y sin la URL del script (vista previa local): el
    // registro se completa mandando el mensaje por WhatsApp.
    if ((ES_EXPORT_ESTATICO || SIN_SERVIDOR) && !APPS_SCRIPT_URL) {
      window.open(linkWhatsapp, "_blank", "noopener,noreferrer");
      setEnlaceWa(linkWhatsapp);
      setEstado("enviado");
      return;
    }

    setEstado("enviando");
    try {
      // Con la URL del script (producción en hosting estático) se envía
      // directo a la hoja de Google; si no, pasa por /api/registro.
      const respuesta = APPS_SCRIPT_URL
        ? await fetch(APPS_SCRIPT_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" }, // evita el preflight CORS
            body: JSON.stringify({ tipo: "acceso", id: nuevoIdEnvio(), nombre, whatsapp, tipoUsuario }),
            redirect: "follow",
          })
        : await fetch("/api/registro", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, whatsapp, tipoUsuario }),
          });

      const data = await respuesta.json().catch(() => null);
      if (!respuesta.ok || (APPS_SCRIPT_URL && data?.ok !== true)) {
        // El servidor responde en español; en inglés se muestra el genérico.
        throw new Error((idioma === "es" && data?.error) || t.formulario.errorGenerico);
      }

      setEstado("enviado");
    } catch (err) {
      // `fetch` tira TypeError cuando no hay conexión con el servidor.
      const sinConexion = err instanceof TypeError;
      setError(
        sinConexion
          ? t.formulario.errorConexion
          : err instanceof Error
            ? err.message
            : t.formulario.errorGenerico,
      );
      if (sinConexion) setEnlaceWa(linkWhatsapp);
      setEstado("error");
    }
  }

  return (
    <section id="acceso" data-zona="oscura" className="tex-plano relative border-t border-yeso/8 bg-carbon py-24 md:py-32">
      <div className="contenedor grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
        <ScrollReveal className="lg:pt-6">
          <p className="etiqueta text-oliva">{t.formulario.etiqueta}</p>
          <h2 className="titulo mt-5 text-[2rem] text-yeso md:text-[2.75rem]">
            {t.formulario.titulo[0]}
            <br />
            {t.formulario.titulo[1]}
          </h2>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-oliva">{t.formulario.bajada}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div data-zona="funcional" className="bg-yeso px-6 py-9 sm:px-10 sm:py-11">
            {estado === "enviado" ? (
              <div className="animate-aparecer flex min-h-92 flex-col items-start justify-center" role="status">
                <Monograma fondo="yeso" className="h-10 w-10" />
                {enlaceWa ? (
                  <>
                    <p className="titulo mt-8 text-[1.75rem] text-carbon">{t.formulario.waTitulo}</p>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-tierra/80">
                      {t.formulario.waTexto}
                    </p>
                    <a
                      href={enlaceWa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="boton boton-oxido mt-8 min-h-12"
                    >
                      {t.formulario.abrirWa}
                    </a>
                  </>
                ) : (
                  <>
                    <p className="titulo mt-8 text-[1.75rem] text-carbon">{t.formulario.exitoTitulo}</p>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-tierra/80">
                      {t.formulario.nota}
                    </p>
                  </>
                )}
              </div>
            ) : (
              <form action={enviar} className="flex flex-col">
                <label htmlFor="nombre" className="etiqueta text-[10px] text-oliva-oscuro">
                  {t.formulario.nombre}
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  required
                  autoComplete="name"
                  placeholder={t.formulario.nombrePlaceholder}
                  className={CAMPO}
                />

                <fieldset className="mt-9">
                  <legend className="etiqueta text-[10px] text-oliva-oscuro">{t.formulario.participas}</legend>
                  <div role="radiogroup" className="mt-4 grid grid-cols-2 gap-2.5">
                    {OPCIONES.map((opcion) => {
                      const elegido = tipoUsuario === opcion;
                      return (
                        <button
                          key={opcion}
                          type="button"
                          role="radio"
                          aria-checked={elegido}
                          onClick={() => setTipoUsuario(opcion)}
                          className={cn(
                            "min-h-12 border px-3 text-[13px] transition-colors duration-300",
                            elegido
                              ? "border-oxido bg-oxido-claro text-carbon"
                              : "border-arena text-oliva-oscuro hover:border-tierra/40 hover:text-tierra",
                          )}
                        >
                          {t.formulario.opciones[opcion]}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <label htmlFor="whatsapp" className="etiqueta mt-9 text-[10px] text-oliva-oscuro">
                  {t.formulario.whatsapp}
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  required
                  autoComplete="tel"
                  placeholder="+591"
                  className={cn(CAMPO, "tabular-nums")}
                />

                {error && (
                  <p role="alert" className="mt-6 border-l-2 border-oxido pl-3 text-[13px] text-oxido-oscuro">
                    {error}
                    {enlaceWa && (
                      <>
                        {" "}
                        <a href={enlaceWa} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                          {t.formulario.enviarPorWa}
                        </a>
                      </>
                    )}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={estado === "enviando"}
                  className="boton boton-carbon mt-9 min-h-13 w-full disabled:cursor-wait disabled:opacity-70"
                >
                  {estado === "enviando" ? t.formulario.enviando : t.formulario.enviar}
                </button>

                <p className="mt-5 text-center text-xs leading-relaxed text-oliva-oscuro">
                  {t.formulario.nota}
                </p>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
