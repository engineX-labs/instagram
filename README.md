# engineX — producción de contenido para Instagram

Sistema para producir el contenido de **@enginex.labs** con código: reels (Remotion) y carruseles (HTML/CSS → PNG con Playwright), sobre un único sistema de design tokens.

> Si se puede pensar, lo construimos.

---

## Requisitos

- Node.js 20 o más nuevo, y pnpm 10 (`corepack enable` lo activa).
- ffmpeg en el PATH: lo usan las hojas de contacto de `pnpm stills` y la verificación del reel.
- Chromium para Playwright: `pnpm exec playwright install chromium` (una sola vez).
- Remotion descarga solo su Chrome Headless Shell la primera vez que renderiza.

```bash
pnpm install
pnpm tokens          # genera tokens/tokens.css y verifica contrastes
```

---

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm render:carousel <slug>` | Renderiza `carousels/posts/<slug>.json` → `out/carousels/<slug>/01.png, 02.png…` |
| `pnpm render:reel <slug>` | Renderiza un reel → `out/reels/<slug>.mp4` (H.264, 1080×1920, 30 fps, sin audio) |
| `pnpm studio` | Abre Remotion Studio con el reel y las composiciones de prueba de cada componente |
| `pnpm stills <Composición> [frames]` | Exporta fotogramas de control y una hoja de contacto en `out/stills/` |
| `pnpm tokens` | Regenera `tokens/tokens.css` desde `tokens/tokens.ts` y chequea WCAG |
| `pnpm typecheck` | Chequeo de tipos de todo el repo |
| `pnpm fonts` | Re-copia Space Grotesk desde `@fontsource` a `assets/fonts` (solo al actualizar la fuente) |

Posts disponibles: `que-hacemos`, `senales-sistema`, `antes-despues-facturar`.
Reels disponibles: `reel-01`.

---

## Estructura

```
assets/
  logo/        logo original (SVG animado; fuente de los colores y la geometría)
  fonts/       Space Grotesk 400/500/700 (woff2, subset latin) + licencia OFL
tokens/
  tokens.ts    ÚNICA fuente de verdad: color, tipografía, espaciado, radios, movimiento, zonas seguras
  tokens.css   GENERADO por `pnpm tokens` (no editar)
  logo.ts      geometría del logo y de la flecha (compartida por reels y carruseles)
  icons.ts     íconos SVG propios
carousels/
  posts/       un JSON por post
  templates/   una plantilla por tipo de slide + base.css + layout.ts (cromo común)
  lib/         tipos del JSON y utilidades de texto
  render.ts    script de render
reels/
  src/components/    Hook, LogoReveal, PhoneMockup, CodeTyping, BeforeAfter, Captions, Outro…
  src/compositions/  Reel01 (+ reel01.data.ts con el contenido) y Tests (una por componente)
  src/lib/           fuentes, motion helpers, medición de texto, parser de Whisper
  public/            medios para los reels (capturas). `public/fonts` se copia sola
  captions/          JSON de Whisper
  render.ts          script de render
scripts/       build-tokens, copy-fonts, sync-reels-public, stills
entregas/      renders aprobados, versionados (out/ está en .gitignore)
out/           salida de trabajo de todos los scripts
```

---

## Sistema de diseño

**Colores**: los tres colores de marca se extrajeron literalmente del SVG del logo.

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#0E1116` | fondo |
| `text` | `#FFFFFF` | texto principal (18.9:1) |
| `accent` | `#FF5B2E` | naranja de la flecha, énfasis (6.1:1 sobre `bg`: AA incluso en texto chico) |
| `textSecondary` | `#A9B0BB` | texto de apoyo (8.7:1) |
| `textMuted` | `#8A929E` | numerador, handle (6.0:1) |
| `onAccent` | `#0E1116` | texto sobre naranja (el blanco da 3.1:1, no se usa) |

**Tipografía:** Space Grotesk (SIL OFL 1.1), la misma tipografía del logo. Usa tres pesos: 400 (texto), 500 (etiquetas) y 700 (títulos).

**Movimiento:**
- 120 BPM, donde 1 beat = 15 frames a 30 fps.
- Curvas de easing:
  - `enter` (0.16, 1, 0.3, 1)
  - `exit` (0.7, 0, 0.84, 0)
  - `emphasis` (0.34, 1.56, 0.64, 1)
  - `standard` (0.6, 0, 0.3, 1): es la misma curva del logo animado.

**Zonas seguras:**

| Formato | Arriba | Abajo | Laterales |
|---|---|---|---|
| Reels | 120 px (barra de estado) | 260 px (caption, audio, usuario) | 100 px (columna de íconos) |
| Carruseles | 60 px | 60 px | 60 px |

En el Studio, las composiciones `Test-*` muestran las zonas inseguras rayadas.

---

## Agregar un carrusel nuevo

1. Creá `carousels/posts/<slug>.json`. El `slug` del JSON tiene que coincidir con el nombre del archivo:

   ```json
   {
     "slug": "mi-post",
     "name": "Referencia interna",
     "slides": [
       { "type": "cover", "kicker": "Etiqueta", "title": "Título con *énfasis naranja.*" },
       { "type": "content", "icon": "stock", "title": "Un mensaje por slide.", "body": "Texto corto opcional." },
       { "type": "list-item", "number": 1, "title": "Ítem de una lista numerada." },
       { "type": "before-after", "state": "before", "title": "Cómo es hoy.", "points": ["Problema 1.", "Problema 2."] },
       { "type": "before-after", "state": "after", "title": "Cómo queda." },
       { "type": "points", "title": "Qué cambia:", "points": ["Uno.", "Dos.", "Tres."] },
       { "type": "cta", "title": "¿Pregunta final? *Remate.*", "body": "Opcional.", "action": "Escribinos por mensaje directo" }
     ]
   }
   ```

   - `*texto*` se pinta en naranja.
   - Íconos disponibles: `stock`, `invoice`, `qr`, `calendar`, `check`, `cross`. Para sumar uno, se agrega en `tokens/icons.ts`.
   - El numerador (1/6), el handle y "Deslizá →" se agregan solos. "Deslizá" no aparece en la última slide.

2. Corré `pnpm render:carousel mi-post`.

3. El render **se frena** si encuentra:
   - comillas rectas (`"`, `'`): usá “ ” y ’;
   - ¿? o ¡! desbalanceados;
   - emojis;
   - una fuente que no cargó;
   - cualquier elemento fuera de la zona segura o con texto recortado.

4. Revisá todas las slides en `out/carousels/mi-post/`. El HTML intermedio queda en `_html/` por si querés abrirlo en un navegador.

5. Si la aprobás, copiala a `entregas/carruseles/mi-post/`.

---

## Agregar un reel nuevo

1. Creá `reels/src/compositions/ReelNN.tsx` (usá `Reel01.tsx` como modelo).
   - Componé con `<Sequence>` y los componentes de `reels/src/components/`.
   - Medí los tiempos en beats con `beats(n)`, para que los cortes caigan en el ritmo.
   - Dejá el contenido en un `reelNN.data.ts` aparte.
2. Registralo en dos lugares:
   - `reels/src/Root.tsx`, como `<Composition id="ReelNN" …>`;
   - el mapa `REELS` de `reels/render.ts`, como `"reel-NN": "ReelNN"`.
3. Iterá en `pnpm studio`.
4. Revisá fotogramas con `pnpm stills ReelNN 0,30,60,…`.
5. Exportá con `pnpm render:reel reel-NN`. El script verifica el archivo con ffprobe: H.264, 1080×1920, 30 fps, sin audio.

### Reemplazar los placeholders del Reel #1

1. Copiá las capturas (PNG, JPG o MP4) a `reels/public/captures/`.
2. En `reels/src/compositions/reel01.data.ts`, completá `capture` en cada ejemplo, por ejemplo `capture: "captures/stock.mp4"`.
3. Volvé a correr `pnpm render:reel reel-01`.

Mientras `capture` esté vacío, el teléfono muestra "CAPTURA PENDIENTE".

### Componentes (props principales)

| Componente | Props |
|---|---|
| `Hook` | `text` (marcado: `*énfasis*`, `\|` = pausa, `\n` = salto), `wordInterval`, `pauseFrames`, `size` (se achica solo si no entra), `exitAt` |
| `LogoReveal` | `width`, `subtitle`, `kickAt` (disparo de la flecha), `exitAt` |
| `PhoneMockup` | `src` (imagen/video en `reels/public`), `placeholderLabel`, `placeholderIcon`, `width`, `from`, `enterAt`, `exitAt` |
| `CodeTyping` | `code`, `filename`, `speed` (caracteres/frame), `typeAt` |
| `BeforeAfter` | `before`, `after` (`{ title, points? }`), `wipeAt`, `wipeDuration` |
| `Captions` | `whisper` (JSON), `maxWords`, `lift`, `plate` |
| `Outro` | `handle`, `cta` |

---

## Subtítulos desde audio (pipeline con Whisper)

Este pipeline está documentado pero todavía no se ejecutó. El componente `Captions` lee el JSON de [openai-whisper](https://github.com/openai/whisper) o de faster-whisper con marcas de tiempo por palabra.

1. **Extraer el audio** del video, en mono a 16 kHz:
   ```bash
   ffmpeg -i voz.mp4 -ac 1 -ar 16000 voz.wav
   ```
2. **Transcribir** en español con marcas de tiempo por palabra:
   ```bash
   pip install -U openai-whisper
   whisper voz.wav --model medium --language es --word_timestamps True \
     --output_format json --output_dir reels/captions
   ```
   Esto genera `reels/captions/voz.json`.
3. **Revisar el texto a mano.** Whisper se equivoca con nombres propios ("engineX", "ARCA"). Corregí `word` en el JSON y mantené los tiempos.
4. **Usarlo** en la composición:
   ```tsx
   import voz from "../../captions/voz.json";
   <Captions whisper={voz} maxWords={4} />
   ```

`reels/captions/ejemplo.whisper.json` es un ejemplo escrito a mano para la composición `Test-Captions`. No es una transcripción real.

Los subtítulos se ubican sobre la zona segura inferior y van de a "páginas" de hasta 4 palabras. Se corta antes si termina un segmento o si hay un silencio de más de 0,6 s. La palabra que suena se ve en naranja.

---

## Notas

- **Sin audio:** los reels se exportan mudos y la música se agrega desde la biblioteca de Instagram. El Reel #1 está armado a 120 BPM: los cortes caen en los beats 4, 12, 15, 18, 21 y 24.
- **Sin descarga de Chrome:** en entornos donde Remotion no puede bajar su Chrome (CI, sandbox), exportá `REMOTION_BROWSER_EXECUTABLE=/ruta/a/chrome-headless-shell`.
- **Licencias:**
  - Space Grotesk tiene licencia SIL OFL 1.1 (ver `assets/fonts/OFL-SpaceGrotesk.txt`).
  - Los íconos y gráficos son SVG propios.
  - Remotion es gratis para personas y empresas de hasta 3 personas. Con más gente hace falta una [licencia de empresa](https://www.remotion.dev/license).
- **Reglas de contenido:** nada de emojis en los renders, nada de métricas, testimonios ni clientes inventados, y puntuación española correcta (“ ” ’ ¿ ¡).
