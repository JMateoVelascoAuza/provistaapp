"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { enlace, ES_EXPORT_ESTATICO } from "@/lib/enlace";

export function Enlace({ href, ...props }: ComponentProps<typeof Link>) {
  if (ES_EXPORT_ESTATICO) {
    return <a href={enlace(href as string)} {...props} />;
  }
  return <Link href={href} {...props} />;
}
