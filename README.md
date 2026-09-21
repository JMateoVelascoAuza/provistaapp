# Provista — Landing page

Landing page de **una sola vista** para Provista, instalable como PWA —
según el contrato original y el documento oficial de contenido
(`Provista_Contenido_Landing.pdf`, compartido por el cliente). Ver
`aclaracion_landing_provista.md` en `../provista-app/` para el contrato.
No confundir con el marketplace completo, pausado en
`../provista-app-marketplace-backup/` sin contrato firmado detrás.

> Nota histórica: entre medio se armó una versión de 5 páginas separadas
> por pedido explícito, pero el documento de contenido oficial del
> cliente volvió a describir una sola vista con nav de anclas — así que
> se revirtió a eso, que además es lo único que coincide con el
> contrato firmado.

> **`/demo` es una segunda ruta fuera de contrato**, agregada a pedido
> explícito para pulsear interés del cliente — ver sección dedicada más
> abajo. La landing en `/` sigue siendo de una sola vista, tal cual el
> contrato.

## Estructura (7 secciones, todas en `/`)

1. Hero — degradado `gris-seccion` a blanco
2. El problema — `gris-seccion`
3. Cómo funciona — blanco
4. Diferenciador — `gris-seccion`
5. Para quién es — blanco
6. Formulario — marino (única sección oscura)
7. Footer — `gris-seccion`

Cada sección vive en `src/components/sections/`. Header y Footer están
en `src/app/layout.tsx` (persistentes, aunque solo hay una página).

## Identidad visual

Ya no es un placeholder neutro — viene del documento de contenido
oficial (`Provista_Contenido_Landing.pdf`), definida en
`src/app/globals.css`:

- **Marino** `#0C2340` — fondos oscuros, titulares, logo (`marino-*`)
- **Azul secundario** `#3E5C76` — textos de apoyo, avatares (`marino-500`)
- **Naranja** `#EA580C` — botones, acentos, alertas (`naranja-*`)
- **Claro de marca** `#D9E2EC` (`claro-marca`) y **Gris de sección**
  `#F7FAFC` (`gris-seccion`)
- **Tipografía Poppins**, autohospedada con `next/font/local` en
  `src/fonts/` (nunca `next/font/google`). Si el Anexo A
  trae otros pesos/variantes, agregarlos ahí.

**Sigue pendiente el Anexo C** (íconos oficiales 192×192/512×512): los
de `public/icons/` son un placeholder ya con los colores de marca (fondo
marino + barra naranja), pero no el ícono real. El logo en
`src/components/ui/Logo.tsx` también es un placeholder de texto.

## Transiciones y elementos dinámicos entre secciones

Sobre lo anterior, se sumó una capa de "pegamento" entre secciones para
que la página se sienta como un recorrido, no como bloques apilados:

- `SeccionOnda` — divisor ondulado (SVG) entre cada sección, en vez del
  corte recto de color contra color. Los colores se toman de
  `src/lib/colores.ts` (deben coincidir con `globals.css`).
- `ScrollProgressBar` — línea fina arriba de todo que se llena con el
  scroll de la página.
- `SectionDots` — puntos de navegación a la derecha (solo `xl:`) que
  resaltan la sección activa y saltan a ella al hacer clic.
- `BackToTop` — botón flotante que aparece después de cierto scroll.
- `Parallax` — el fondo del Hero (manchas de color + íconos flotantes)
  se mueve a otra velocidad que el contenido al hacer scroll.
- Scroll suave (`scroll-behavior: smooth` + `scroll-padding-top` para
  que el header sticky no tape la sección al saltar por ancla).
- Las pestañas de "Cómo funciona" cambian de panel con un
  deslizamiento (`.animate-slide-fade`) en vez de un fade plano.

Ninguno de estos esconde contenido real — son overlays/indicadores o
movimiento puramente decorativo (`Parallax`, `SeccionOnda`) o UI que no
existe hasta que hay suficiente scroll para que tenga sentido
(`BackToTop`, `ScrollProgressBar`) — mismo criterio de seguridad que
`ScrollReveal`, sin repetir su mecanismo donde no hace falta.

## Formulario → Google Sheets

Sección 6 del documento pide que los envíos se registren automáticamente
en una hoja de Google Sheets **provista por el comitente** (columnas:
Fecha y hora | Nombre | Tipo de usuario | WhatsApp). Todavía no la
tenemos, así que `src/app/api/registro/route.ts` está armado para pegar
la URL de un Google Apps Script (publicado como "Web app") en
`GOOGLE_SHEETS_WEBHOOK_URL` apenas el comitente la comparta — no hace
falta cuenta de servicio ni credenciales de Google Cloud. Sin esa
variable configurada, el registro queda en los logs del servidor, para
poder probar el formulario de punta a punta ya mismo.

## Elementos de vida/animación agregados sobre el documento base

El documento de contenido no los pide explícitamente, pero se sumaron
para que la página no se sienta plana — todos opcionales de ajustar o
quitar, ninguno cambia el copy ni la estructura de las 7 secciones:

- `MaterialesTicker` — tira de categorías en loop infinito (CSS puro)
  entre el Hero y "El problema".
- `FloatingIcons` — íconos decorativos flotando en el Hero (solo en
  `lg:` — en mobile no hay margen y tapaban el título, ver bug abajo).
- `CountUp` — el "Ahorras Bs X" del Hero cuenta desde 0.
- `TiltCard` — inclinación 3D sutil siguiendo el mouse, en las tarjetas
  de Diferenciador y Para quién es.
- `ChatSimulado` — la secuencia de chat de "El problema" ahora tiene un
  indicador de "escribiendo…" (3 puntos) antes de cada respuesta del
  proveedor, no solo aparecen las burbujas.
- `.bg-blueprint` — textura de grid tipo plano de construcción en Hero
  y Diferenciador, para romper el fondo sólido.
- `MagneticButton` — envuelve los dos CTA del Hero; el botón se corre
  unos px siguiendo el cursor al pasar cerca (`gsap.quickTo` sobre
  `x`/`y`). Puramente decorativo, nunca gatea si el botón es clickeable.
- `CursorGlow` — halo radial que sigue el mouse dentro del Hero,
  aparece/desaparece con la entrada/salida del cursor.

**2 bugs reales encontrados armando esto** (verificados en build de
producción cuando aplica, no solo en dev):
- `CountUp` se quedaba pegado en 0 en desarrollo: la guarda
  `useRef` para "no correr dos veces" interactuaba mal con el
  doble-invocado de efectos de React StrictMode (la limpieza cancelaba
  el primer `requestAnimationFrame`, y la guarda ya en `true` bloqueaba
  el segundo intento de arrancarlo). Se sacó la guarda — la función de
  limpieza del propio `useEffect` ya alcanza para manejarlo bien.
- Los íconos flotantes del Hero tapaban el título en mobile (el layout
  de una sola columna no tiene el margen lateral que sí hay en
  desktop) — ahora están ocultos por debajo de `lg`.

## `/demo` — fuera de contrato, para pulsear interés del cliente

Ruta separada (`src/app/demo/`) que muestra, con mockups estilizados,
cómo se vería la **app completa** (catálogo, carrito, seguimiento,
panel de ferretería, panel de fletes) — no forma parte del alcance
contratado (solo landing de una vista) y lo dice explícitamente en la
propia página, al pie: *"Esta es una propuesta para conversar, todavía
no forma parte del alcance contratado."* Se agregó a pedido explícito
para ver si el cliente se entusiasma con ampliar el contrato, no porque
el documento de contenido lo pida.

- Header muestra un link **"Demo"** en naranja con ícono de estrellas,
  distinto del resto del nav, para que quede claro que es algo aparte.
  Como el Header ahora vive en dos rutas, todas las anclas usan
  `/#seccion` (ruta absoluta) en vez de `#seccion` a secas — si no,
  clickear una ancla desde `/demo` no te llevaría a `/`.
- `AppleScrollFeatures` (`src/components/demo/`) — storytelling de
  scroll estilo Apple ("scrollea y las opciones se van poniendo"): un
  wrapper alto (`PASOS.length * 100vh`) contiene un panel `sticky` que
  queda fijo en pantalla; un listener de scroll calcula el progreso
  dentro del tramo y decide qué paso (1 de 5) está activo. El contenido
  arranca montado en el paso 0 tanto en servidor como cliente — el
  scroll solo decide cuál mostrar, nunca esconde todo de entrada.
- `PhoneFrame` + `MockScreens` — mockups de teléfono hechos desde cero
  con Tailwind (no son código reciclado del marketplace pausado, ya
  que la línea gráfica cambió) para las 5 pantallas: catálogo, carrito,
  seguimiento en vivo, dashboard de ferretería, panel de fletes.
- `SectionDots` (los puntos de navegación laterales) se desactiva fuera
  de `/` con un chequeo de `usePathname()` — si no, quedaban dando
  vueltas sin sentido en `/demo`, que no tiene esas secciones.

**Bug real encontrado y arreglado en esta ronda** (solo visible en
mobile, no en desktop): el panel `sticky` de `AppleScrollFeatures` mide
`h-[calc(100vh-4rem)]` con `overflow-hidden`, y en mobile el layout
pasa a una sola columna (teléfono arriba, lista de 5 pasos abajo). El
teléfono era `520px` fijo sin importar el viewport, así que sumado a la
lista el contenido medía ~1060px contra un panel de ~780px de alto —
el `overflow-hidden` recortaba de forma permanente e invisible el
extremo superior e inferior (parte del teléfono y/o el último paso),
verificado con `getComputedStyle`/`scrollHeight` en un viewport de
390×844. Se arregló haciendo responsive tanto `PhoneFrame` (150×300 en
mobile → 520×260 desde `md:`) como los gaps/paddings de la lista de
pasos, bajando el contenido total a ~630px — cómodo dentro del panel en
cualquier celular.

## Setup local

```bash
npm install
cp .env.example .env.local   # opcional: agrega GOOGLE_SHEETS_WEBHOOK_URL real
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4.
- `@ducanh2912/next-pwa` para PWA (`--webpack` en `dev`/`build`).
- GSAP + `@gsap/react` (`ScrollTrigger`) para animaciones al hacer
  scroll: secuencia de chat en "El problema", tarjetas del
  diferenciador entrando desde los costados, etc.
- `next/font/local` con Poppins autohospedada.

## Animaciones — reglas para no repetir bugs ya encontrados

- **Header y Hero (lo que se ve al cargar) = CSS puro**
  (`.animate-fade-up` / `.animate-hero-in` en `globals.css`), nunca GSAP
  gateando su visibilidad — el HTML del servidor ya llega visible, y un
  efecto de JS que lo esconda recién al montar produce un parpadeo real.
- **Todo lo que arranca fuera de pantalla usa `ScrollReveal`/
  `ScrollStagger`** (`src/components/ui/ScrollReveal.tsx`): el estado
  "oculto" lo aplica `gsap.fromTo` recién cuando el efecto corre, así
  que sin JS el contenido nunca se esconde.
- **Bug real ya resuelto**: en secciones/páginas cortas donde el
  contenido ya está a la vista sin scrollear, `ScrollTrigger` a veces
  calculaba mal su propio "ya lo pasamos, dispará ya" (confirmado hasta
  en build de producción) y se quedaba invisible para siempre.
  `ScrollReveal`/`ScrollStagger` ahora chequean si el elemento ya está a
  la vista al montar y, si es así, lo muestran directo sin pasar por
  ScrollTrigger. **No saques ese chequeo (`yaVisible`) al editar ese
  archivo.**
- El toggle de pestañas en "Cómo funciona" cambia el panel con un
  `key={activo}` + `.animate-fade-up` — es un cambio de estado real
  disparado por un click, no contenido inicial, así que un crossfade
  CSS ahí es seguro.

## Checklist

- [x] Una sola vista con las 7 secciones + nav de anclas + menú mobile
- [x] Contenido exacto del documento oficial (copy, estructura, tarjetas,
      pestañas interactivas, secuencia de chat animada)
- [x] Identidad visual del documento (colores + Poppins autohospedada)
- [x] PWA: manifest + íconos placeholder (con colores de marca) + favicon
- [x] Formulario → Google Sheets (placeholder hasta tener la hoja real)
- [x] Aviso de privacidad (modal)
- [x] Responsive (móvil y escritorio) + animaciones GSAP
- [x] `/demo` — mockups de la app completa con scroll estilo Apple,
      fuera de contrato, para pulsear interés del cliente
- [ ] Reemplazar ícono/logo con el Anexo C cuando llegue
- [ ] Pegar `GOOGLE_SHEETS_WEBHOOK_URL` real cuando el comitente la pase
- [ ] Deploy
