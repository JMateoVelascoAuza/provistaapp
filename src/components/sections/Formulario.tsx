"use client";

import { useEffect, useState } from "react";
import { Monograma } from "@/components/ui/Logo";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { WHATSAPP_ENTREOBRA } from "@/lib/datos";
import { ES_EXPORT_ESTATICO } from "@/lib/enlace";
import { escucharTipoUsuario, type TipoUsuario } from "@/lib/tipoUsuario";
import { cn } from "@/lib/utils";

type Estado = "idle" | "enviando" | "enviado" | "error";

const OPCIONES: { valor: TipoUsuario; label: string }[] = [
  { valor: "obra", label: "Estoy en obra" },
  { valor: "proveedor", label: "Vendo materiales" },
];

function enlaceWhatsapp(nombre: string, tipo: TipoUsuario, whatsapp: string) {
  const participa = OPCIONES.find((o) => o.valor === tipo)?.label ?? "";
  const texto = [
    "Hola, quiero acceso anticipado a Entreobra.",
    `Nombre: ${nombre}`,
    `Participo como: ${participa}`,
    `Mi WhatsApp: ${whatsapp}`,
  ].join("\n");
  return `https://wa.me/${WHATSAPP_ENTREOBRA}?text=${encodeURIComponent(texto)}`;
}

const CAMPO =
  "w-full border-0 border-b border-arena bg-transparent px-0 py-3 text-[15px] text-carbon outline-none transition-colors duration-300 placeholder:text-oliva focus:border-oxido focus-visible:outline-none";

export function Formulario() {
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("obra");
  const [estado, setEstado] = useState<Estado>("idle");
  const [error, setError] = useState<string | null>(null);
  const [enlaceWa, setEnlaceWa] = useState<string | null>(null);

  // Los CTA de "Dos lados" llegan con el tipo ya elegido.
  useEffect(() => escucharTipoUsuario(setTipoUsuario), []);

  async function enviar(formData: FormData) {
    const nombre = String(formData.get("nombre") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const linkWhatsapp = enlaceWhatsapp(nombre, tipoUsuario, whatsapp);
    setError(null);
    setEnlaceWa(null);

    // La build estática (archivo abierto sin servidor) no tiene
    // /api/registro: el registro se completa mandando el mensaje por
    // WhatsApp, que funciona en cualquier lado.
    if (ES_EXPORT_ESTATICO) {
      window.open(linkWhatsapp, "_blank", "noopener,noreferrer");
      setEnlaceWa(linkWhatsapp);
      setEstado("enviado");
      return;
    }

    setEstado("enviando");
    try {
      const respuesta = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, whatsapp, tipoUsuario }),
      });

      if (!respuesta.ok) {
        const data = await respuesta.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo enviar. Intenta de nuevo.");
      }

      setEstado("enviado");
    } catch (err) {
      // `fetch` tira TypeError cuando no hay conexión con el servidor.
      const sinConexion = err instanceof TypeError;
      setError(
        sinConexion
          ? "No pudimos conectarnos. Intenta de nuevo o mándanos tu registro por WhatsApp."
          : err instanceof Error
            ? err.message
            : "No se pudo enviar. Intenta de nuevo.",
      );
      if (sinConexion) setEnlaceWa(linkWhatsapp);
      setEstado("error");
    }
  }

  return (
    <section id="acceso" className="tex-plano relative border-t border-yeso/8 bg-carbon py-24 md:py-32">
      <div className="contenedor grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
        <ScrollReveal className="lg:pt-6">
          <p className="etiqueta text-oliva">Acceso anticipado</p>
          <h2 className="titulo mt-5 text-[2rem] text-yeso md:text-[2.75rem]">
            Sé de los primeros
            <br />
            en usarlo.
          </h2>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-oliva">
            Estamos armando la plataforma en Cochabamba. Déjanos tus datos y te avisamos apenas abramos.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="bg-yeso px-6 py-9 sm:px-10 sm:py-11">
            {estado === "enviado" ? (
              <div className="animate-aparecer flex min-h-92 flex-col items-start justify-center" role="status">
                <Monograma fondo="yeso" className="h-10 w-10" />
                {enlaceWa ? (
                  <>
                    <p className="titulo mt-8 text-[1.75rem] text-carbon">Solo falta enviar el mensaje.</p>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-tierra/80">
                      Te abrimos WhatsApp con tus datos ya escritos. Envíalo y quedas anotado.
                    </p>
                    <a
                      href={enlaceWa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="boton boton-oxido mt-8 min-h-12"
                    >
                      Abrir WhatsApp
                    </a>
                  </>
                ) : (
                  <>
                    <p className="titulo mt-8 text-[1.75rem] text-carbon">Listo, ya estás anotado.</p>
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-tierra/80">
                      Sin costo y sin compromiso. Solo te escribimos cuando la plataforma esté lista.
                    </p>
                  </>
                )}
              </div>
            ) : (
              <form action={enviar} className="flex flex-col">
                <label htmlFor="nombre" className="etiqueta text-[10px] text-oliva-oscuro">
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  required
                  autoComplete="name"
                  placeholder="Tu nombre"
                  className={CAMPO}
                />

                <fieldset className="mt-9">
                  <legend className="etiqueta text-[10px] text-oliva-oscuro">¿Cómo participas?</legend>
                  <div role="radiogroup" className="mt-4 grid grid-cols-2 gap-2.5">
                    {OPCIONES.map((opcion) => {
                      const elegido = tipoUsuario === opcion.valor;
                      return (
                        <button
                          key={opcion.valor}
                          type="button"
                          role="radio"
                          aria-checked={elegido}
                          onClick={() => setTipoUsuario(opcion.valor)}
                          className={cn(
                            "min-h-12 border px-3 text-[13px] transition-colors duration-300",
                            elegido
                              ? "border-oxido bg-oxido-claro text-carbon"
                              : "border-arena text-oliva-oscuro hover:border-tierra/40 hover:text-tierra",
                          )}
                        >
                          {opcion.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <label htmlFor="whatsapp" className="etiqueta mt-9 text-[10px] text-oliva-oscuro">
                  WhatsApp
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
                          Enviar por WhatsApp
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
                  {estado === "enviando" ? "Enviando…" : "Avísenme cuando abra"}
                </button>

                <p className="mt-5 text-center text-xs leading-relaxed text-oliva-oscuro">
                  Sin costo y sin compromiso. Solo te escribimos cuando la plataforma esté lista.
                </p>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
