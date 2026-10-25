/**
 * Geometría del logo engineX, copiada 1:1 del SVG original
 * (assets/logo/enginex-logo-animado.original.svg) para que reels (React) y
 * carruseles (HTML) dibujen exactamente la misma marca.
 *
 * La X vive en una caja de 64×64 y se compone de:
 *  - dos trazos blancos (diagonal ↘ partida en el centro),
 *  - la flecha naranja (diagonal ↗ + punta en ángulo),
 *  - una "estela" naranja al 40 % desplazada (-7, 7).
 */
import { brand } from "./tokens.ts";

export const X_BOX = 64;
export const X_STROKE = 9;

export const xMark = {
  whiteSegments: [
    { x1: 10, y1: 10, x2: 25, y2: 25 },
    { x1: 39, y1: 39, x2: 54, y2: 54 },
  ],
  arrowShaft: { x1: 10, y1: 54, x2: 52, y2: 12 },
  arrowHead: [
    [28, 10],
    [54, 10],
    [54, 36],
  ] as const,
  ghostOffset: { x: -7, y: 7 },
  ghostOpacity: 0.4,
} as const;

/** Logo completo: viewBox recortado al contenido (medido sobre el original, +8 px de aire). */
export const logoLayout = {
  viewBox: { x: 174, y: 140, width: 558, height: 144 },
  word: { text: "engine", x: 176.5, y: 248, fontSize: 140, letterSpacing: -6, fontWeight: 700 },
  x: { tx: 612.05, ty: 137.55, scale: 1.9 },
} as const;

const line = (l: { x1: number; y1: number; x2: number; y2: number }, color: string) =>
  `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="${color}" stroke-width="${X_STROKE}" stroke-linecap="round"/>`;

/** Solo la X (caja 64×64). `ghost` = incluir la estela. */
export function xMarkSvgInner({ ghost = true, white = brand.white } = {}): string {
  const { whiteSegments, arrowShaft, arrowHead, ghostOffset, ghostOpacity } = xMark;
  return [
    ghost
      ? `<g opacity="${ghostOpacity}" transform="translate(${ghostOffset.x} ${ghostOffset.y})">${line(arrowShaft, brand.orange)}</g>`
      : "",
    ...whiteSegments.map((s) => line(s, white)),
    line(arrowShaft, brand.orange),
    `<polyline points="${arrowHead.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${brand.orange}" stroke-width="${X_STROKE}" stroke-linecap="round" stroke-linejoin="round"/>`,
  ].join("");
}

/** Logo "engine" + X como SVG inline. Requiere Space Grotesk 700 cargada en la página. */
export function logoSvg({ height = 48, ghost = true } = {}): string {
  const { viewBox: vb, word, x } = logoLayout;
  const width = (vb.width / vb.height) * height;
  return `<svg class="logo" xmlns="http://www.w3.org/2000/svg" width="${width.toFixed(1)}" height="${height}" viewBox="${vb.x} ${vb.y} ${vb.width} ${vb.height}" role="img" aria-label="engineX">
<text x="${word.x}" y="${word.y}" font-family="'Space Grotesk', sans-serif" font-weight="${word.fontWeight}" font-size="${word.fontSize}" letter-spacing="${word.letterSpacing}" fill="${brand.white}">${word.text}</text>
<g transform="translate(${x.tx} ${x.ty}) scale(${x.scale})">${xMarkSvgInner({ ghost })}</g>
</svg>`;
}

/**
 * Flecha naranja suelta (recurso gráfico): el mismo trazo + punta de la X.
 * `rotate` en grados; 0 = apunta ↗ como en el logo, 45 = apunta → (para "deslizá").
 */
export function arrowSvg({ size = 64, rotate = 0, color = brand.orange as string } = {}): string {
  const { arrowShaft: s, arrowHead } = xMark;
  return `<svg class="arrow" xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true">
<g transform="rotate(${rotate} 32 32)">
<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="${color}" stroke-width="${X_STROKE}" stroke-linecap="round"/>
<polyline points="${arrowHead.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${color}" stroke-width="${X_STROKE}" stroke-linecap="round" stroke-linejoin="round"/>
</g></svg>`;
}
