/**
 * Genera tokens/tokens.css desde tokens/tokens.ts y verifica contrastes WCAG.
 * Uso: pnpm tokens   (falla con exit 1 si algún par no cumple su mínimo)
 */
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tokens, contrastPairs } from "../tokens/tokens.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ---------------- contraste (WCAG 2.x) ---------------- */

/** Parsea #RRGGBB o rgba(r,g,b,a) a [r,g,b] 0-255 (el alfa se ignora: solo se usan colores opacos como texto). */
function rgb(color: string): [number, number, number] {
  if (color.startsWith("#")) {
    const n = parseInt(color.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const m = color.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) throw new Error(`Color no soportado: ${color}`);
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

function luminance(color: string): number {
  const [r, g, b] = rgb(color).map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/* ---------------- CSS ---------------- */

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
const lines: string[] = [];
const v = (name: string, value: string | number) => lines.push(`  --${name}: ${value};`);

for (const [k, val] of Object.entries(tokens.colors)) v(`color-${kebab(k)}`, val);
lines.push("");
for (const [k, val] of Object.entries(tokens.fontFamily)) v(`font-${k}`, val);
for (const [k, val] of Object.entries(tokens.fontWeights)) v(`weight-${k}`, val);
for (const [k, val] of Object.entries(tokens.fontSize)) v(`text-${kebab(k)}`, `${val}px`);
for (const [k, val] of Object.entries(tokens.lineHeight)) v(`leading-${k}`, val);
for (const [k, val] of Object.entries(tokens.letterSpacing)) v(`tracking-${k}`, val);
lines.push("");
for (const [k, val] of Object.entries(tokens.space)) v(`space-${k}`, `${val}px`);
for (const [k, val] of Object.entries(tokens.radius)) v(`radius-${k}`, `${val}px`);
lines.push("");
for (const [k, val] of Object.entries(tokens.safeZone.carousel)) v(`safe-${k}`, `${val}px`);
lines.push("");
const ms = (frames: number) => `${Math.round((frames / tokens.rhythm.fps) * 1000)}ms`;
for (const [k, val] of Object.entries(tokens.duration)) v(`duration-${k}`, ms(val));
for (const [k, val] of Object.entries(tokens.easing)) v(`ease-${k}`, `cubic-bezier(${val.join(", ")})`);

const fontFaces = Object.values(tokens.fontWeights)
  .map(
    (w) => `@font-face {
  font-family: "Space Grotesk";
  font-style: normal;
  font-weight: ${w};
  font-display: block;
  src: url("../assets/fonts/space-grotesk-latin-${w}-normal.woff2") format("woff2");
}`,
  )
  .join("\n");

const css = `/* ARCHIVO GENERADO por scripts/build-tokens.ts desde tokens/tokens.ts. No editar a mano. */

${fontFaces}

:root {
${lines.join("\n")}
}
`;

writeFileSync(join(root, "tokens/tokens.css"), css);
console.log("✓ tokens/tokens.css generado\n");

/* ---------------- reporte de contraste ---------------- */

let failed = false;
console.log("Contraste WCAG (fg sobre bg):");
for (const { fg, bg, min } of contrastPairs) {
  const ratio = contrast(tokens.colors[fg], tokens.colors[bg]);
  const ok = ratio >= min;
  if (!ok) failed = true;
  console.log(
    `  ${ok ? "✓" : "✗"} ${fg.padEnd(14)} / ${bg.padEnd(8)} ${ratio.toFixed(2).padStart(5)}:1  (mín ${min})`,
  );
}
// Informativo: por qué el texto sobre naranja va en negro y no en blanco.
const wo = contrast(tokens.colors.text, tokens.colors.accent);
console.log(`  · info: text/accent ${wo.toFixed(2)}:1 → blanco sobre naranja NO se usa para texto`);

if (failed) {
  console.error("\n✗ Hay pares que no cumplen el contraste mínimo.");
  process.exit(1);
}
