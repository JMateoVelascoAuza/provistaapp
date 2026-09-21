# Storyboard — Experiencia premium estilo Apple

Fase 1 (análisis) y Fase 2 (storyboard) de
`CLAUDE_LANDING_PAGE_MASTER_PROMPT.md`, aplicado a `provista-landing`.
Documento vivo: se ajusta si algo cambia durante la implementación.

## Fase 1 — Qué hay hoy (resumen del análisis)

**Stack:** Next.js 16 App Router (`--webpack`), TS, Tailwind v4, GSAP +
`@gsap/react` (`useGSAP`, `ScrollTrigger`) — **ya es el motor de
animación del proyecto**, no hace falta sumar Framer Motion ni ninguna
librería nueva; el master prompt pide usar la herramienta apropiada
para cada caso y GSAP ya cubre scroll storytelling, microinteracciones
(`quickTo` en `MagneticButton`/`CursorGlow`/`TiltCard`) y timelines.

**Dos superficies con reglas distintas:**
- `/` — landing de una sola vista. **Contenido, copy, orden de
  secciones y colores/tipografía son del contrato** (documento oficial
  del cliente). Acá el master prompt aplica solo a **motion**, nunca a
  contenido: "no cambies textos existentes si no es necesario" calza
  perfecto con esa restricción ya existente.
- `/demo` — pieza fuera de contrato para pulsear interés del cliente.
  Es exactamente lo que el master prompt llama **"la DEMO es
  prioritaria"** (sección 10): acá hay libertad total para construir la
  experiencia cinematográfica completa (sticky, zoom, transformaciones
  continuas) sin restricción de copy.

**Reutilizable tal cual:** `ScrollReveal`/`ScrollStagger` (con el
chequeo `yaVisible` — no tocar), `MagneticButton`, `CursorGlow`,
`TiltCard`, `SeccionOnda`, `Parallax`, Header con transparencia→blur al
scrollear (ya sigue la sección 15), `PhoneFrame` + `MockScreens` (ya
son HTML/CSS "sin inventar funcionalidades", sección 20).

**Gap real encontrado:** no existe manejo de `prefers-reduced-motion`
en ningún componente (sección 27 del master prompt lo exige). Hay que
sumarlo como utilidad transversal antes de tocar las escenas.

**Lo que pide un cambio de enfoque:** `AppleScrollFeatures.tsx` hoy
funciona con un listener de `scroll` manual + estado de React
(crossfade por opacity/translate-y). Funciona, pero no es lo que pide
la sección 8/9/10: timelines reales de `ScrollTrigger` con `pin` +
`scrub`, zoom con propósito, y transformación continua entre pantallas
en vez de "pantalla desaparece → pantalla aparece".

---

## Fase 2 — Storyboard

### Parte A — `/` (landing contratada): motion, no contenido

El principio acá es **bookend + continuidad**, sin tocar una sola
palabra ni el orden de las 7 secciones.

```
SCENE 01 — Hero
Ya existe: entrada escalonada CSS (badge → título → párrafo → CTAs →
panel de precios → línea de ahorro). Se queda igual — es lo único
seguro contra el flash de contenido inicial.

↓ (scroll saliendo del Hero — NUEVO)

SCENE 02 — Hero exit / Ticker entry
El título y párrafo del Hero se desvanecen con blur sutil + translateY
(scrub), mientras el panel de precios ("Buscaste... Cemento IP-30")
escala levemente hacia arriba y se centra — es el "producto" (la
propuesta de valor) el que sobrevive la transición, no un corte.
GSAP ScrollTrigger(scrub) sobre transform/opacity únicamente.
Mobile: sin blur ni scale, solo fade (sección 21).
MaterialesTicker entra con un stagger-scale suave de las categorías
en vez de aparecer ya animándose en loop.

↓

SCENE 03 — Problema (ya cumple el principio, tocar poco)
La secuencia de chat con "escribiendo…" ya es una escena con
storytelling propio. Se mantiene. Foco de ritmo: es el primer "calma
+ información" del recorrido (sección 14).

↓

SCENE 04 — Cómo funciona
Tabs con swap por click ya usan slide-fade. Se agrega una entrada de
sección con revelación de titular grande antes de las tabs (word/line
reveal simple, CSS o ScrollReveal — no scrub necesario, es contenido
que ya está, solo more presencia tipográfica).

↓

SCENE 05 — Diferenciador (ya cumple, tocar poco)
TiltCard + ScrollReveal from left/right ya da la sensación de
comparación entrando en cámara. Se mantiene.

↓

SCENE 06 — Para quién es (beat de calma, sección 14)
Deliberadamente el más simple del recorrido — contraste antes del
cierre.

↓

SCENE 07 — Cierre (Formulario + Footer) — bookend con el Hero
Antes del form, un titular grande (reusa el copy ya existente de esa
sección, no se inventa texto nuevo) entra con el mismo lenguaje visual
que abrió el Hero (fade + translate + escala leve), como eco de
apertura/cierre que pide la sección 35. Footer se mantiene minimalista
tal cual está.
```

**Regla dura para toda la Parte A:** ningún efecto puede ocultar
contenido en el render inicial (sigue aplicando la lección ya aprendida
con `ScrollTrigger` + `yaVisible`). Todo lo nuevo acá es decorativo:
transform/opacity sobre elementos ya visibles e interactivos.

### Parte B — `/demo`: la pieza insignia (foco principal del trabajo)

Reconstruye `AppleScrollFeatures` como una timeline real de
`ScrollTrigger` (`pin: true`, `scrub: true`), manteniendo **las mismas
5 funcionalidades reales que ya están** (catálogo, carrito, seguimiento,
panel de ferretería, panel de fletes) — no se inventa ninguna nueva.

```
SCENE D0 — Intro (existe, se refina)
Badge + título + párrafo del tope de /demo. Misma entrada CSS seria
(sin FOUC), un poco más cinematográfica (blur sutil + translate más
largo).

↓

SCENE D1 — Presentación del producto (NUEVO)
Antes de entrar al carrusel pineado: el teléfono con MockCatalogo
aparece solo, centrado, grande — opacity + scale + translate, "así se
ve la app" antes de explicar función por función.

↓

SCENE D2 — Sticky (rehecho con ScrollTrigger pin+scrub real)
El panel queda fijo; a medida que se scrollea:
- El teléfono activo no hace un crossfade plano: se achica + rota
  levemente + se desvanece mientras el siguiente teléfono crece desde
  un tamaño menor y se desvanece hacia adentro — transformación
  continua, no "A desaparece → B aparece" (sección 34).
- El texto del paso activo entra con fade + translateX corto, atado a
  la misma timeline de scrub (ya no es un simple max-height toggle).

↓

SCENE D3 — Zoom / Highlight (NUEVO, por paso)
En el pico de cada paso, un pequeño zoom (scale 1 → 1.08 → 1) sobre el
elemento clave de esa pantalla:
  1. Catálogo → zoom sobre la fila de precios
  2. Carrito → zoom sobre "Confirmar pedido"
  3. Seguimiento → zoom sobre el ícono de camión
  4. Dashboard ferretería → zoom sobre las 3 métricas
  5. Fletes → zoom sobre "Aceptar"
Es el "Dashboard → zoom → funcionalidad" de la sección 10, Escena 3/4.

↓

SCENE D4 — Cierre (NUEVO)
Al terminar el paso 5, cámara se aleja: el teléfono activo escala
hacia abajo y se recentra, la sección se "libera" (unpin), y el CTA
existente ("¿Te interesa llevar esto adelante?") entra con el mismo
fade+scale del cierre de la Parte A — mismo lenguaje visual en ambos
cierres del sitio.
```

**Mobile (`/demo`):** se mantiene el mecanismo sticky que ya probamos
y funciona en 390×844, pero **sin** el pulso de zoom por paso ni
rotación — solo opacity + scale mínimo entre pantallas (sección 21:
menos elementos simultáneos, menos blur, animaciones simplificadas).

### Transversal — nuevo en esta ronda

- **`usePrefersReducedMotion`** (hook chico, `matchMedia`): cuando es
  `true`, todas las escenas nuevas (Hero exit, Demo pin/scrub/zoom)
  caen a fade simple sin scrub ni pin, sección 27.
- Sin librerías nuevas — todo con GSAP/ScrollTrigger + CSS, como ya
  viene el proyecto.
- Estructura de carpetas se mantiene (`sections/`, `demo/`, `ui/`); el
  cambio grande de código es dentro de `AppleScrollFeatures.tsx` (pasa
  de listener manual a timeline de `ScrollTrigger`) y ajustes puntuales
  en `Hero.tsx` y la sección de `Formulario`/cierre.

---

## Orden de implementación (Fase 3, pendiente de luz verde)

1. `usePrefersReducedMotion` + wiring base.
2. Rehacer `AppleScrollFeatures` (pin + scrub + zoom por paso) — es la
   pieza prioritaria según el master prompt.
3. Escena D1 (presentación del producto) y D4 (cierre) en `/demo`.
4. Hero exit scrub + entrada de MaterialesTicker en `/`.
5. Titular de cierre en Formulario (bookend con Hero).
6. QA completo: consola, hydration, `ScrollTrigger.refresh()`, overflow
   horizontal, responsive (1920/1440/1024/768/430/390/375), reduced
   motion activado, build + lint.
