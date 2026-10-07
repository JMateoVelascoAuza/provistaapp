import { NextResponse } from "next/server";
import { VERSION_POLITICAS } from "@/lib/datos";

/**
 * El comitente todavía no compartió la hoja de Google Sheets (Sección 6
 * del documento de contenido). El patrón elegido es un Google Apps
 * Script publicado como Web App: el comitente crea el script en SU
 * hoja, lo publica como "Web app" y nos pasa esa URL — no hace falta
 * una cuenta de servicio ni credenciales de Google Cloud.
 *
 * Columnas esperadas en la hoja (en este orden):
 *   Fecha | Nombre | Participa como | WhatsApp | Acepta privacidad | ID envío
 *
 * Sin GOOGLE_SHEETS_WEBHOOK_URL configurada, el registro se guarda en
 * los logs del servidor en vez de fallar, para poder probar el formulario
 * de punta a punta sin la hoja todavía.
 */

type TipoUsuario = "obra" | "proveedor";

function esTipoUsuarioValido(valor: unknown): valor is TipoUsuario {
  return valor === "obra" || valor === "proveedor";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const nombre = typeof body?.nombre === "string" ? body.nombre.trim() : "";
  const whatsapp = typeof body?.whatsapp === "string" ? body.whatsapp.trim() : "";
  const tipoUsuario = body?.tipoUsuario;

  // Sin el consentimiento expreso no se guarda nada (DS 1793, art. 56).
  if (body?.consentimiento !== true) {
    return NextResponse.json({ error: "Para enviar tus datos tienes que aceptar la Política de privacidad." }, { status: 400 });
  }

  if (!nombre || !whatsapp || !esTipoUsuarioValido(tipoUsuario)) {
    return NextResponse.json(
      { error: "Completa tu nombre, WhatsApp y cómo participas." },
      { status: 400 },
    );
  }

  // Mismo formato que manda la página cuando no hay servidor
  // (apps-script/Code.gs lo escribe en la pestaña "Acceso anticipado").
  const fila = {
    tipo: "acceso",
    id: crypto.randomUUID(),
    nombre,
    whatsapp,
    tipoUsuario,
    consentimiento: true,
    versionPoliticas: VERSION_POLITICAS,
  };

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;

  if (!webhookUrl) {
    console.log("[registro] GOOGLE_SHEETS_WEBHOOK_URL no configurada. Registro:", fila);
    return NextResponse.json({ ok: true, modo: "sin-hoja-configurada" });
  }

  try {
    const respuesta = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(fila),
    });

    const data = await respuesta.json().catch(() => null);
    if (!respuesta.ok || data?.ok !== true) {
      throw new Error(`La hoja respondió ${respuesta.status}: ${data?.error ?? "sin detalle"}`);
    }
  } catch (error) {
    console.error("[registro] Error escribiendo en Google Sheets:", error);
    return NextResponse.json(
      { error: "No se pudo guardar tu registro. Intenta de nuevo." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
