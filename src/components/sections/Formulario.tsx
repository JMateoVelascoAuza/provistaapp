"use client";

import { useState } from "react";
import { HardHat, Loader2, Send, Store } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

type TipoUsuario = "obra" | "proveedor";
type Estado = "idle" | "enviando" | "enviado" | "error";

export function Formulario() {
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("obra");
  const [estado, setEstado] = useState<Estado>("idle");
  const [error, setError] = useState<string | null>(null);

  async function enviar(formData: FormData) {
    setEstado("enviando");
    setError(null);

    try {
      const respuesta = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.get("nombre"),
          whatsapp: formData.get("whatsapp"),
          tipoUsuario,
        }),
      });

      if (!respuesta.ok) {
        const data = await respuesta.json().catch(() => null);
        throw new Error(data?.error ?? "No se pudo enviar. Intenta de nuevo.");
      }

      setEstado("enviado");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar. Intenta de nuevo.");
      setEstado("error");
    }
  }

  return (
    <section id="formulario" className="bg-marino-900 py-20 text-white">
      <div className="mx-auto max-w-lg px-4 sm:px-8">
        <ScrollReveal className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Sé de los primeros en usar Provista
          </h2>
          <p className="mt-2 text-marino-200">
            Estamos armando la plataforma en Cochabamba. Déjanos tus datos y te
            avisamos apenas abramos.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {estado === "enviado" ? (
            <div className="animate-hero-in mt-8 rounded-2xl bg-white p-8 text-center text-marino-900">
              <p className="text-lg font-semibold">¡Listo, ya te tenemos anotado!</p>
              <p className="mt-2 text-sm text-marino-500">
                Sin costo y sin compromiso. Solo te escribimos cuando la plataforma esté lista.
              </p>
            </div>
          ) : (
            <form
              action={enviar}
              className="mt-8 space-y-4 rounded-2xl bg-white p-6 text-marino-900 shadow-xl"
            >
              <div>
                <label htmlFor="nombre" className="mb-1.5 block text-sm font-medium text-marino-700">
                  Nombre
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  required
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-marino-100 px-4 py-2.5 text-sm outline-none focus:border-naranja-500 focus:ring-2 focus:ring-naranja-500/20"
                />
              </div>

              <div>
                <p className="mb-1.5 text-sm font-medium text-marino-700">¿Cómo participas?</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTipoUsuario("obra")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                      tipoUsuario === "obra"
                        ? "border-naranja-500 bg-naranja-50 text-naranja-700"
                        : "border-marino-100 text-marino-500",
                    )}
                  >
                    <HardHat size={16} />
                    Estoy en obra
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoUsuario("proveedor")}
                    className={cn(
                      "flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition",
                      tipoUsuario === "proveedor"
                        ? "border-naranja-500 bg-naranja-50 text-naranja-700"
                        : "border-marino-100 text-marino-500",
                    )}
                  >
                    <Store size={16} />
                    Vendo materiales
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="whatsapp" className="mb-1.5 block text-sm font-medium text-marino-700">
                  WhatsApp
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  required
                  placeholder="+591"
                  className="w-full rounded-xl border border-marino-100 px-4 py-2.5 text-sm outline-none focus:border-naranja-500 focus:ring-2 focus:ring-naranja-500/20"
                />
              </div>

              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

              <button
                type="submit"
                disabled={estado === "enviando"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-naranja-600 py-3 text-sm font-semibold text-white transition hover:bg-naranja-700 disabled:opacity-60"
              >
                {estado === "enviando" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                Avísenme cuando abra
              </button>

              <p className="text-center text-xs text-marino-400">
                Sin costo y sin compromiso. Solo te escribimos cuando la plataforma esté lista.
              </p>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
