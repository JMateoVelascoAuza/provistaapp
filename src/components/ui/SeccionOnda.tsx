/**
 * Divisor ondulado entre secciones — reemplaza el corte recto entre
 * bloques de color por una curva, para que la página no se sienta como
 * rectángulos apilados. Es un SVG estático: no es contenido, así que no
 * hay ningún riesgo de parpadeo por esconder algo.
 *
 * `fondo` = color de la sección de ARRIBA (el fondo detrás de la onda).
 * `color` = color de la sección de ABAJO (lo que "sube" en la onda).
 */
export function SeccionOnda({ fondo, color }: { fondo: string; color: string }) {
  return (
    <div aria-hidden className="relative h-10 sm:h-16" style={{ backgroundColor: fondo }}>
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path
          d="M0,40 C 200,100 400,0 600,40 C 800,80 1000,20 1200,50 L1200,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
