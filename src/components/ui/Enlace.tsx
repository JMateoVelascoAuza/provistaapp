"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { enlace, ES_EXPORT_ESTATICO } from "@/lib/enlace";

/**
 * Reemplazo de `next/link` para links entre páginas ("/demo", "/",
 * "/#formulario") que también tienen que andar en la build exportada
 * abierta como archivo local. `<Link>` de Next no solo usa una URL
 * absoluta — además precarga la página con `fetch()` en cuanto entra
 * al viewport, y eso también falla bajo `file://` (sin servidor).
 * En la build exportada usamos una `<a>` común: navegación real del
 * navegador, sin JS de por medio, cero riesgo de que la app intente
 * "arreglar" la navegación con un fetch que no puede funcionar ahí.
 */
export function Enlace({ href, ...props }: ComponentProps<typeof Link>) {
  if (ES_EXPORT_ESTATICO) {
    return <a href={enlace(href as string)} {...props} />;
  }
  return <Link href={href} {...props} />;
}
