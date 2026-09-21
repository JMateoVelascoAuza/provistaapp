import { NextResponse } from "next/server";

/**
 * El comitente todavía no compartió la hoja de Google Sheets (Sección 6
 * del documento de contenido). El patrón elegido es un Google Apps
 * Script publicado como Web App: el comitente crea el script en SU
 * hoja, lo publica como "Web app" y nos pasa esa URL — no hace falta
 * una cuenta de servicio ni credenciales de Google Cloud.
 *
 * Columnas esperadas en la hoja (en este orden):
 *   Fecha y hora | Nombre | Tipo de usuario | WhatsApp
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

  if (!nombre || !whatsapp || !esTipoUsuarioValido(tipoUsuario)) {
    return NextResponse.json(
      { error: "Completa tu nombre, WhatsApp y cómo participas." },
      { status: 400 },
    );
  }

  const fila = {
    fecha: new Date().toISOString(),
    nombre,
    tipoUsuario: tipoUsuario === "obra" ? "Estoy en obra" : "Vendo materiales",
    whatsapp,
  };

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log("[registro] GOOGLE_SHEETS_WEBHOOK_URL no configurada. Registro:", fila);
    return NextResponse.json({ ok: true, modo: "sin-hoja-configurada" });
  }

  try {
    const respuesta = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fila),
    });

    if (!respuesta.ok) {
      throw new Error(`La hoja respondió ${respuesta.status}`);
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
