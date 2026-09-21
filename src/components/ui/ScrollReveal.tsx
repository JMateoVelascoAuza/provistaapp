"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type Direccion = "up" | "left" | "right";

/**
 * Revela contenido con GSAP + ScrollTrigger cuando entra en el viewport.
 *
 * A diferencia de un `IntersectionObserver` manual que esconde el
 * elemento vía una clase CSS presente desde el primer render (server Y
 * cliente), acá el estado "oculto" lo aplica `gsap.fromTo` recién cuando
 * el efecto corre — es decir, **solo si JS se ejecutó**. Sin JS el
 * elemento nunca se esconde (queda con su opacidad normal del HTML que
 * mandó el servidor).
 *
 * Si el elemento YA está a la vista en el momento en que este efecto
 * corre (páginas cortas, o esta sección cae dentro del primer viewport),
 * NO lo animamos con ScrollTrigger — lo mostramos directo. Esto evita un
 * bug real que encontramos: ScrollTrigger a veces calcula mal su propio
 * "ya lo pasamos, dispará ya" en ese caso puntual (confirmado hasta en
 * build de producción) y la sección se quedaba invisible para siempre,
 * porque nunca ocurre un scroll real que la saque de ese estado.
 */
function yaVisible(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.9;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  from = "up",
  distance = 32,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: Direccion;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      if (yaVisible(ref.current)) {
        gsap.set(ref.current, { opacity: 1, y: 0, x: 0 });
        return;
      }

      gsap.fromTo(
        ref.current,
        {
          opacity: 0,
          y: from === "up" ? distance : 0,
          x: from === "left" ? -distance : from === "right" ? distance : 0,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.8,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}

/** Igual que ScrollReveal, pero anima directamente a los hijos con stagger. */
export function ScrollStagger({
  children,
  className,
  itemSelector = ":scope > *",
  stagger = 0.1,
  from,
  distance = 28,
}: {
  children: React.ReactNode;
  className?: string;
  itemSelector?: string;
  stagger?: number;
  from?: Direccion;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const items = ref.current.querySelectorAll(itemSelector);
      if (items.length === 0) return;

      if (yaVisible(ref.current)) {
        gsap.set(items, { opacity: 1, y: 0, x: 0, scale: 1 });
        return;
      }

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: from ? 0 : distance,
          x: from === "left" ? -distance : from === "right" ? distance : 0,
          scale: from ? 1 : 0.96,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration: 0.7,
          stagger,
          ease: from ? "power3.out" : "back.out(1.6)",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 82%",
            once: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
