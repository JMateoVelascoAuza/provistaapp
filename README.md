# Entreobra — Landing page

Landing page de **una sola vista** para Entreobra (antes "Provista"),
instalable como PWA. El rediseño sigue
`Entreobra_Rediseno_Desarrollador.pdf` (cambio de marca, identidad
visual y estructura de página) — no agrega funcionalidad: sigue siendo
una landing sin login, sin base de datos, sin carrito y sin pagos
(Cláusula Tercera del contrato).

> **`/demo` es una segunda ruta fuera de contrato**, agregada a pedido
> explícito para pulsear interés del cliente — ver sección dedicada más
> abajo. Hereda la marca nueva vía los alias de color de `globals.css`.

## Estructura (todas en `/`)

1. **Hero** (`#top`) — wordmark translúcido sobre "fotografía", titular,
   CTA y barra de métricas flotante.
2. **Materiales** (`#materiales`) — las seis categorías como bloques
   fotográficos numerados.
3. **Cómo funciona** (`#como-funciona`) — cuatro pasos.
4. **Comparador** (`#comparar`) — zona funcional, fondo yeso.
5. **Dos lados** (`#proveedores`) — comprador y proveedor. Sus CTA
   llevan al formulario con el tipo de usuario ya elegido
   (`src/lib/tipoUsuario.ts`).
6. **Acceso anticipado** (`#acceso`) — formulario de tres campos.
7. **Footer** — logo, contacto, redes, aviso de privacidad.

Header y Footer están en `src/app/layout.tsx`. Los datos de ejemplo
(proveedores, precios, categorías) viven en `src/lib/datos.ts`: el
"Bs 240" del hero se calcula del comparador, así nunca se contradicen.

## Identidad visual

Definida en `src/app/globals.css` (tokens de Tailwind v4):

| Token   | Hex       | Uso                                             |
| ------- | --------- | ----------------------------------------------- |
| carbon  | `#242220` | fondos oscuros, secciones principales           |
| tierra  | `#46413C` | titulares y texto fuerte sobre fondo claro      |
| oliva   | `#8F9289` | texto secundario, etiquetas                     |
| arena   | `#C4BDB2` | bordes y separadores                            |
| yeso    | `#F2EFEA` | fondos claros, zona funcional                   |
| oxido   | `#C2410C` | botones, alertas, acentos — nunca fondos grandes |

- `oliva-oscuro` (`#696C63`) solo para texto chico sobre yeso, donde el
  oliva original no llega al contraste mínimo.
- Los tokens viejos `marino-*`/`naranja-*` quedan como alias de la
  paleta Tierra para `/demo`; la landing no los usa.
- **Tipografía Jost** (300 titulares/wordmark, 400 texto), autohospedada
  y embebida en `src/app/fuentes.css` (generado desde `src/fonts/`).
  Nunca `next/font/google`.
- Wordmark: versalitas, interletrado 9 px y bajada 7 px; en móvil a la
  mitad (`.wordmark`, `.wordmark-bajada`).
- Monograma de corchetes en `src/components/ui/Logo.tsx`; los íconos PWA
  (`public/icons/`, 192/512 + variantes maskable) y `public/favicon.png`
  son el mismo dibujo.

### Fotografía (pendiente)

Las texturas de los bloques son **marcadores generados en CSS/SVG**
(`.tex-*` en `globals.css`). Cuando lleguen las fotos reales, pasar
`src` a `<Foto>` (`src/components/ui/Foto.tsx`): aplica sola el
tratamiento de marca (desaturada, sombras viradas a carbón) y la capa
carbón del 40–60% para fotos con texto encima.

## Instalar como PWA — botón + instrucciones

El contrato pide que la landing sea instalable, así que además del
manifest/service worker (`@ducanh2912/next-pwa`) hay un flujo real para
que el usuario la instale sin saber qué es una PWA:

- `usePwaInstall` (`src/lib/`) detecta tres cosas: si el navegador
  disparó `beforeinstallprompt` (Chrome/Edge/Android — ahí SÍ hay un
  botón nativo real para instalar con un clic), si es Safari en iOS
  (ese navegador **nunca** dispara ese evento — no lo implementa, no es
  un bug nuestro), y si ya está instalada (`display-mode: standalone`).
- `InstalarPwa` (`src/components/ui/`) — botón flotante abajo a la
  izquierda que **no se muestra** si ya está instalada o si el
  navegador no soporta ninguno de los dos caminos (ej. Firefox/Safari
  de escritorio) — no tiene sentido prometer un botón que no hace nada
  ahí. Al tocarlo abre un modal que se adapta:
  - **Con prompt nativo**: explicación corta + botón "Instalar
    Entreobra" que dispara el prompt real del navegador.
  - **iOS**: pasos numerados con íconos (compartir → agregar a
    pantalla de inicio → confirmar), porque ahí no existe instalación
    de un clic.
  - Arriba del todo, en los dos casos, se ve el ícono real de la app
    (`/icons/icon-192.png`) del tamaño que va a tener en el celular —
    responde directo al "¿cómo se va a ver?".
- `appleWebApp` en la metadata de `layout.tsx` (`capable: true`,
  `statusBarStyle: "default"`) — sin esto, aunque el usuario siga los
  pasos manuales en iOS, Safari la abre como una pestaña más en vez de
  a pantalla completa sin barra de navegador.

Probado con Playwright simulando los 4 casos (Chrome de escritorio sin
evento, Android/Chrome con el evento disparado, iOS por user-agent, y
ya instalada) — el botón aparece solo cuando corresponde en cada uno.

## Formularios → Google Sheets

Los dos formularios escriben en **la hoja del cliente** a través de un solo
Google Apps Script (`apps-script/Code.gs`):

| Formulario | Pestaña |
|---|---|
| Registro de productos (`/registro/`) | `Hoja 1` (las 14 columnas del cliente + `ID envío` al final) |
| Acceso anticipado (landing) | `Acceso anticipado` (se crea sola) |

La URL del script va en **un solo lugar**: `NEXT_PUBLIC_APPS_SCRIPT_URL`
(ver `.env.example`). `scripts/sincronizar-registro.mjs` la escribe en la
página de registro antes de cada `dev`/`build`. Sin URL, todo funciona
igual en local: los formularios terminan en WhatsApp / CSV.

Los dos formularios piden una casilla de aceptación de la Política de
privacidad y mandan `consentimiento: true` + `versionPoliticas`. El script
rechaza cualquier envío sin ese dato (DS 1793, art. 56).

## Páginas legales

`/privacidad`, `/terminos`, `/cookies` y `/reembolsos` salen de
`src/lib/legal.ts` (ES/EN) y se pintan con `components/legal/PaginaLegal.tsx`.

- **Datos del negocio:** `NEGOCIO` en `src/lib/datos.ts`. Razón social, NIT,
  matrícula SEPREC y dirección están vacíos a propósito y no se muestran
  hasta completarlos. No inventar valores.
- **Si cambia un texto legal:** actualizar la fecha (`fecha` en `legal.ts`)
  y `VERSION_POLITICAS` en `datos.ts` y en el `CONFIG` de `registro/index.html`.
- **Cookies:** el sitio no usa cookies ni analíticas, por eso no hay aviso de
  cookies. Si se agrega analítica o publicidad, hace falta pedir permiso antes
  de cargarla y actualizar `/cookies`.

## Publicar en producción (Namecheap, hosting estático)

**Una vez, en la hoja del cliente:** Extensiones → Apps Script → pegar
`apps-script/Code.gs` → Implementar → Nueva implementación → Aplicación web
(Ejecutar como: yo · Acceso: cualquier persona) → copiar la URL `/exec`.
Si después se cambia el script: Administrar implementaciones → Editar →
Nueva versión (así la URL no cambia).

**Cada publicación:**

```bash
cp .env.example .env.production.local     # la primera vez
# pegar la URL en NEXT_PUBLIC_APPS_SCRIPT_URL
npm run build:hosting                     # genera out/ (landing, /demo/, /registro/)
```

Subir **el contenido** de `out/` (incluido el `.htaccess`, que es un archivo
oculto) a `public_html` en cPanel → Administrador de archivos (lo más
rápido: comprimir `out/` en .zip, subirlo y extraerlo ahí). En cPanel →
SSL/TLS Status, activar AutoSSL para `entreobra.com` y `www`.

`public/.htaccess` fuerza HTTPS, redirige `www` → sin www, usa la 404 propia
y define la caché (archivos con hash 1 año; HTML y service worker siempre
frescos). `scripts/ajustar-export.mjs` corre solo después del build.

Probar después de subir: la landing, `/demo/`, `/registro/`, un envío de
cada formulario (deben aparecer en la hoja) y que `http://` redirija a
`https://`.

## `/demo` — fuera de contrato, para pulsear interés del cliente

Ruta separada (`src/app/demo/`) que muestra, con mockups estilizados,
cómo se vería la **app completa** (catálogo, carrito, seguimiento,
panel de ferretería, panel de fletes) — no forma parte del alcance
contratado (solo landing de una vista) y lo dice explícitamente en la
propia página, al pie: *"Esta es una propuesta para conversar, todavía
no forma parte del alcance contratado."* Se agregó a pedido explícito
para ver si el cliente se entusiasma con ampliar el contrato, no porque
el documento de contenido lo pida.

- El Header (compartido con `/`) ya no enlaza `/demo`: el mockup del
  rediseño no lo incluye. La ruta sigue funcionando por URL directa.
  Todas las anclas del Header usan `/#seccion` (ruta absoluta) para que
  funcionen también desde `/demo`.
- `ProductoIntro` (`src/components/demo/`) — escena nueva antes del
  carrusel: el teléfono con el catálogo aparece solo, grande, centrado
  (`opacity + scale + translate`), estableciendo "así se ve la app"
  antes de explicar función por función.
- `AppleScrollFeatures` (`src/components/demo/`) — storytelling de
  scroll estilo Apple, con **dos mecanismos a propósito** (no el mismo
  efecto reducido en mobile, sino una variante propia):
  - **Desktop (`≥1024px`):** `ScrollTrigger` real con `pin` + `scrub`.
    El progreso continuo del scroll maneja a la vez qué paso está
    activo, una transformación **continua** entre teléfonos (el que
    sale se achica/desvanece mientras el que entra crece/aparece —
    nunca un salto instantáneo) y un **zoom con propósito** sobre el
    elemento clave de cada pantalla (fila de precios, botón "Confirmar
    pedido", ícono del camión, métricas del panel, botón "Aceptar" —
    marcados con `data-highlight` en `MockScreens.tsx`).
  - **Mobile (`<1024px`):** el mecanismo original (sticky CSS +
    listener de scroll) ya probado a fondo en 390×844 — solo decide qué
    paso mostrar, sin zoom ni transformaciones extra, para no
    sobrecargar un viewport chico.
  - Con `prefers-reduced-motion`, ninguno de los dos corre: el paso
    activo queda fijo en 0, sin pin ni scrub.
- `PhoneFrame` + `MockScreens` — mockups de teléfono hechos desde cero
  con Tailwind (no son código reciclado del marketplace pausado, ya
  que la línea gráfica cambió) para las 5 pantallas: catálogo, carrito,
  seguimiento en vivo, dashboard de ferretería, panel de fletes.

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

## 3 bugs reales encontrados en esta ronda

- **Crossfade del carrusel se apagaba al final**: la fórmula de
  progreso mapeaba el scroll a un rango `0..PASOS.length`, así que el
  último paso terminaba su curva de fundido hacia un paso 6 que no
  existe — el teléfono quedaba invisible justo al terminar de
  scrollear. Se arregló mapeando a `0..PASOS.length-1` y sumando una
  zona de "reposo" antes de empezar a mezclar con el vecino.
- **Overflow horizontal real a 375px** (no visible en ningún viewport
  ≥768px): `ScrollReveal from="right"` deja el elemento con
  `translateX(+32px)` como estado de partida (antes de scrollear a la
  vista) — en un viewport angosto sin margen de sobra, eso empujaba el
  contenido más allá del borde derecho y el documento quedaba con
  scroll horizontal real (`scrollWidth > innerWidth`, confirmado que se
  podía scrollear de verdad, no solo una medición). Se agregó
  `overflow-x: hidden` en `html` **y** `body` (hace falta en ambos) —
  es el recorte correcto para un estado de animación que nunca debe
  verse, no un parche cosmético.

## Setup local

```bash
npm install
cp .env.example .env.local   # opcional: agrega GOOGLE_SHEETS_WEBHOOK_URL real
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Computadora nueva (Windows 10/11)

`scripts/instalar-windows.ps1` instala Git, Node.js LTS, GitHub CLI, VS Code
y las extensiones del proyecto (con `winget`, salta lo que ya
esté), hace `npm ci` y verifica script, tipos y lint:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\instalar-windows.ps1
# -SoloProyecto: salta las herramientas (solo dependencias y verificación)
```

### Pruebas

| Comando | Qué hace |
|---|---|
| `npm run prueba:script` | Corre `apps-script/Code.gs` contra una hoja, Gmail y Session simulados (sin Google). |
| `npm run banco` | Hoja de prueba local en http://localhost:5050/hoja (se actualiza sola) que ejecuta el `Code.gs` real. El registro apuntando a ella: http://localhost:5050/registro/. |
| `npm run dev:banco` | El sitio en :3000 con el formulario de la landing enviando al banco (correr junto con `npm run banco`). |
| `npm run typecheck` / `npm run lint` | Tipos y lint. |

No correr `npm run build:*` con `npm run dev` abierto: comparten `.next/` y
el servidor de desarrollo se cae.

## Vista previa local para mandar al cliente (sin servidor, sin hosting)

Para que alguien vea la landing con solo abrir un archivo — doble clic
en `index.html`, sin instalar Node, sin correr nada, sin subir a
ningún lado:

```bash
npm run build:local
```

Esto genera la carpeta `out/` con HTML/CSS/JS 100% estáticos. Comprimila
(`out/` → zip) y mandala — quien la reciba solo tiene que descomprimir
y abrir `index.html` en cualquier navegador. Los dos links del menú
("Cómo funciona"/"Para proveedores" bajan a un ancla; "Demo" abre
`demo.html`) funcionan igual, ya probados con Playwright abriendo
directo `file://` (sin ningún servidor de por medio).

**No usar para producción real** — es solo para previsualizar
localmente. Para eso sigue existiendo `npm run build` (el normal, con
la API de `/api/registro` funcionando).

### Por qué hace falta una build distinta (y no alcanza con `npm run build`)

Next.js arma todo pensando en que hay un servidor/dominio detrás:
rutas de assets absolutas (`/_next/...`), navegación entre páginas vía
`fetch()` de datos (RSC), fuentes vía `next/font`. Ninguna de esas tres
cosas funciona bajo `file://` (no hay "raíz" real, y los service
workers ni siquiera pueden registrarse ahí). `STATIC_EXPORT=1` (ver
`next.config.ts`) cambia lo necesario:

- `output: "export"` + `assetPrefix: "."` — assets con ruta relativa a
  la carpeta del HTML en vez de absoluta. Sin `trailingSlash` a
  propósito: así cada página exporta como archivo plano en la raíz de
  `out/` (`demo.html`, no `demo/index.html`) y todas quedan al mismo
  nivel de profundidad — si no, el "." de arriba deja de alcanzar para
  los assets de las páginas anidadas (bug real encontrado armando
  esto).
- `src/lib/enlace.ts` + `src/components/ui/Enlace.tsx` — reescriben
  los links entre páginas ("/demo", "/#formulario") a relativos, y
  usan un `<a>` común en vez de `next/link` (que además de la URL
  absoluta, precarga la página con `fetch()`, algo que también rompe
  bajo `file://`).
- Jost va como `@font-face` común (`src/app/fuentes.css`), con los
  archivos incrustados en base64 (~10KB cada uno). `next/font` no
  admite un `assetPrefix` relativo — tira error de build — así que no
  es viable para esta build.
- El service worker de la PWA se desactiva en esta build
  (`disable: exportEstatico` en next-pwa) — no tiene forma de
  registrarse bajo `file://`, así que ni se intenta.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4.
- `@ducanh2912/next-pwa` para PWA (`--webpack` en `dev`/`build`).
- GSAP + `@gsap/react` (`ScrollTrigger`): parallax del hero, línea de
  progreso de "Cómo funciona", entradas al hacer scroll.
- Jost autohospedada (`src/app/fuentes.css`).

## Animaciones — reglas para no repetir bugs ya encontrados

- **Header y Hero (lo que se ve al cargar) = CSS puro**
  (`.animate-linea` / `.animate-aparecer` / `.animate-wordmark` en
  `globals.css`), nunca GSAP
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
- La línea de óxido de "Cómo funciona" y el parallax del hero parten
  del estado ya renderizado (`gsap.to` / `scaleX` inicial en la clase),
  así que en scroll 0 se ve igual que el HTML del servidor.
- Todo respeta `prefers-reduced-motion` (CSS y GSAP).

## Checklist

- [x] Rebrand Provista → Entreobra (nombre, dominio, correo, metadata, manifest)
- [x] Paleta Tierra + Jost + wordmark y monograma de corchetes
- [x] Estructura del mockup: hero, materiales, cómo funciona, comparador, dos lados, acceso anticipado, footer
- [x] PWA: manifest + íconos nuevos con el monograma (192/512 + maskable) + favicon
- [ ] Fotografías reales (15–20) en lugar de las texturas marcador
- [ ] Usuarios de Instagram, Facebook y TikTok para el footer
- [x] Botón + modal de instalación de la PWA, con instrucciones
      adaptadas a iOS (manual) vs Android/Chrome (prompt nativo)
- [x] Formulario → Google Sheets (placeholder hasta tener la hoja real)
- [x] Aviso de privacidad (modal)
- [x] Responsive (móvil y escritorio) + animaciones GSAP
- [x] `/demo` — mockups de la app completa con scroll estilo Apple,
      fuera de contrato, para pulsear interés del cliente
- [x] Experiencia cinematográfica:
      `/demo` con `ScrollTrigger` pin+scrub real, zoom por paso y escena
      de presentación del producto; Hero con scroll-exit;
      `prefers-reduced-motion` en toda la capa nueva
- [ ] Reemplazar ícono/logo con el Anexo C cuando llegue
- [ ] Pegar la URL del Apps Script del cliente en `NEXT_PUBLIC_APPS_SCRIPT_URL`
- [ ] Publicar en Namecheap (ver «Publicar en producción»)
