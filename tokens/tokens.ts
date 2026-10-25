/**
 * engineX — design tokens. ÚNICA fuente de verdad.
 *
 * Reels (Remotion) importan este archivo directamente.
 * Carruseles (HTML/CSS) consumen tokens.css, que se GENERA desde acá con `pnpm tokens`.
 * No editar tokens.css a mano.
 */

/* ------------------------------------------------------------------ */
/* Color                                                               */
/* ------------------------------------------------------------------ */

/**
 * Colores base: extraídos literalmente del SVG del logo
 * (assets/logo/enginex-logo-animado.original.svg): fondo `rect fill`,
 * texto "engine" `fill`, flecha `stroke`.
 */
export const brand = {
  black: "#0E1116",
  white: "#FFFFFF",
  orange: "#FF5B2E",
} as const;

/**
 * Paleta completa. Las variantes se derivan de los 3 colores de marca.
 * Los contrastes se verifican en `contrastPairs` al correr `pnpm tokens`
 * (el script falla si alguno no cumple el mínimo declarado).
 */
export const colors = {
  // Fondos (del más oscuro al más claro)
  bg: brand.black, // fondo de todo
  surface: "#161A21", // tarjetas, mockups
  surfaceRaised: "#1F242D", // elementos sobre surface
  line: "#2A303A", // bordes y divisores (no es texto)

  // Texto
  text: brand.white, // texto principal
  textSecondary: "#A9B0BB", // texto de apoyo
  textMuted: "#8A929E", // numerador, handle (texto chico: necesita AA 4.5:1)

  // Acento
  accent: brand.orange, // naranja del logo: énfasis, flecha
  accentSoft: "#FF7A55", // hover/variante clara (no se usa para texto chico)
  accentGhost: "rgba(255, 91, 46, 0.4)", // estela de la flecha (como en el logo)
  onAccent: brand.black, // texto SOBRE fondo naranja (el blanco no llega a AA)
} as const;

export type ColorToken = keyof typeof colors;

/**
 * Resaltado de sintaxis para CodeTyping, solo con colores de marca:
 * naranja para palabras clave, blanco para identificadores, grises para lo secundario.
 */
export const syntax = {
  plain: colors.text,
  keyword: colors.accent,
  string: colors.accentSoft,
  number: colors.accentSoft,
  function: colors.text,
  comment: colors.textMuted,
  punctuation: colors.textSecondary,
} as const;

/** Pares texto/fondo que se usan en piezas reales, con el mínimo WCAG exigido. */
export const contrastPairs: ReadonlyArray<{
  fg: ColorToken;
  bg: ColorToken;
  /** 4.5 = AA texto normal · 3 = AA texto grande (≥ 24px reales o ≥ 18.66px bold) */
  min: 4.5 | 3;
}> = [
  { fg: "text", bg: "bg", min: 4.5 },
  { fg: "text", bg: "surface", min: 4.5 },
  { fg: "textSecondary", bg: "bg", min: 4.5 },
  { fg: "textSecondary", bg: "surface", min: 4.5 },
  { fg: "textMuted", bg: "bg", min: 4.5 },
  { fg: "accent", bg: "bg", min: 4.5 },
  { fg: "accent", bg: "surface", min: 4.5 },
  { fg: "onAccent", bg: "accent", min: 4.5 },
  { fg: "accentSoft", bg: "surface", min: 4.5 }, // strings/números en CodeTyping
];

/* ------------------------------------------------------------------ */
/* Tipografía                                                          */
/* ------------------------------------------------------------------ */

/**
 * Space Grotesk (SIL OFL 1.1): es la tipografía del propio logo, así que texto
 * y marca hablan el mismo idioma; x-height alta y formas abiertas → legible
 * en pantallas chicas. Archivos en assets/fonts (sin CDN).
 */
export const fontFamily = {
  sans: "'Space Grotesk', system-ui, sans-serif",
  /**
   * CodeTyping usa la misma familia (regla: una sola familia) con cifras
   * tabulares; los snippets son cortos y no necesitan alineación monoespaciada.
   */
  code: "'Space Grotesk', ui-monospace, monospace",
} as const;

export const fontWeights = {
  regular: 400, // texto corrido
  medium: 500, // etiquetas, handle, numerador
  bold: 700, // títulos (mismo peso que "engine" en el logo)
} as const;

/**
 * Escala tipográfica en px sobre lienzos de 1080 de ancho.
 * En un celular de ~390 pt el lienzo se ve a ~0.36x:
 * body 44px ≈ 16 pt reales; caption 28px ≈ 10 pt (mínimo para datos discretos).
 */
export const fontSize = {
  caption: 28, // numerador, handle
  small: 34,
  body: 44,
  lead: 56,
  h3: 64,
  h2: 80,
  h1: 104,
  display: 128, // portadas, hooks
} as const;

export const lineHeight = {
  tight: 1.02, // display / títulos grandes
  snug: 1.12, // títulos
  normal: 1.35, // texto corrido
} as const;

/** En em. Negativo en títulos grandes (el logo usa -6/140 ≈ -0.043em). */
export const letterSpacing = {
  display: "-0.04em",
  title: "-0.03em",
  body: "-0.01em",
  label: "0.02em",
} as const;

/* ------------------------------------------------------------------ */
/* Espaciado y radios                                                  */
/* ------------------------------------------------------------------ */

/** Base 8 px. */
export const space = {
  0: 0,
  1: 8,
  2: 16,
  3: 24,
  4: 32,
  5: 48,
  6: 64,
  7: 96,
  8: 128,
  9: 160,
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 32,
  phone: 72, // marco de PhoneMockup
  pill: 999,
} as const;

/** Grosor del trazo de la flecha/X, relativo al logo (9 sobre una caja de 64). */
export const stroke = {
  arrowRatio: 9 / 64,
} as const;

/* ------------------------------------------------------------------ */
/* Formatos y zonas seguras                                            */
/* ------------------------------------------------------------------ */

export const formats = {
  reel: { width: 1080, height: 1920, fps: 30 },
  carousel: { width: 1080, height: 1350 },
} as const;

/**
 * Zonas seguras (px). Nada de texto ni elementos clave fuera de ellas.
 * - Reels: arriba 120 (barra de estado + "Reels"), abajo 260 (caption, audio,
 *   usuario). Laterales 100: decisión propia, la columna de íconos de la derecha
 *   (me gusta, comentarios) tapa la mitad inferior del borde derecho.
 * - Carruseles: 60 de margen general.
 */
export const safeZone = {
  reel: { top: 120, bottom: 260, left: 100, right: 100 },
  carousel: { top: 60, bottom: 60, left: 60, right: 60 },
} as const;

/* ------------------------------------------------------------------ */
/* Movimiento                                                          */
/* ------------------------------------------------------------------ */

/** Grilla rítmica: 120 BPM → 1 beat = 0.5 s = 15 frames a 30 fps. */
export const rhythm = {
  bpm: 120,
  fps: 30,
  framesPerBeat: 15,
} as const;

/** Duraciones en frames (30 fps). Múltiplos de medio beat cuando se puede. */
export const duration = {
  instant: 4, // ~130 ms
  fast: 8, // ~270 ms  (≈ medio beat)
  base: 15, // 500 ms   (1 beat)
  slow: 30, // 1 s      (2 beats)
  stagger: 4, // desfase entre palabras/ítems
} as const;

/**
 * Curvas cubic-bezier [x1, y1, x2, y2].
 * Uso en Remotion: Easing.bezier(...easing.enter).
 * Uso en CSS: var(--ease-enter).
 */
export const easing = {
  /** Entrada: arranca rápido y frena suave (expo-out). */
  enter: [0.16, 1, 0.3, 1],
  /** Salida: arranca lento y se va acelerando. */
  exit: [0.7, 0, 0.84, 0],
  /** Énfasis: pequeño rebote (overshoot) para la palabra clave. */
  emphasis: [0.34, 1.56, 0.64, 1],
  /** Estándar / movimiento de la flecha: la misma curva del SVG animado del logo. */
  standard: [0.6, 0, 0.3, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

/** Config de spring para Remotion (`spring({ config })`) en entradas con énfasis. */
export const springs = {
  snappy: { damping: 14, stiffness: 200, mass: 0.6 },
  soft: { damping: 20, stiffness: 120, mass: 1 },
} as const;

/* ------------------------------------------------------------------ */
/* Marca                                                               */
/* ------------------------------------------------------------------ */

export const brandCopy = {
  name: "engineX",
  handle: "@enginex.labs",
  tagline: "Si se puede pensar, lo construimos.",
} as const;

export const tokens = {
  brand,
  colors,
  syntax,
  fontFamily,
  fontWeights,
  fontSize,
  lineHeight,
  letterSpacing,
  space,
  radius,
  stroke,
  formats,
  safeZone,
  rhythm,
  duration,
  easing,
  springs,
  brandCopy,
} as const;

export default tokens;
