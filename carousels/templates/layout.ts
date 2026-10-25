/** Envoltorio común: documento HTML + cromo (logo, handle, numerador, "deslizá"). */
import { logoSvg, arrowSvg } from "../../tokens/logo.ts";
import { brandCopy } from "../../tokens/tokens.ts";
import type { SlideContext } from "../lib/types.ts";

export interface LayoutOptions {
  ctx: SlideContext;
  /** Clase extra en .slide para variantes de plantilla. */
  variant: string;
  /** HTML del área central. */
  body: string;
  /** CSS propio de la plantilla (se inyecta después de base.css). */
  css?: string;
  /** Rutas absolutas (file://) a tokens.css y base.css. */
  styles: { tokens: string; base: string };
}

export function layout({ ctx, variant, body, css = "", styles }: LayoutOptions): string {
  // "Deslizá" en todas menos la última: la flecha de la marca girada 45° apunta →.
  const swipe = ctx.isLast
    ? ""
    : `<span class="swipe">Deslizá ${arrowSvg({ size: 40, rotate: 45 })}</span>`;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${styles.tokens}">
<link rel="stylesheet" href="${styles.base}">
<style>${css}</style>
</head>
<body>
<main class="slide ${variant}">
  <div class="safe">
    <header class="chrome-top">
      ${logoSvg({ height: 44 })}
      <span class="counter">${ctx.index}/${ctx.total}</span>
    </header>
    <section class="body">${body}</section>
    <footer class="chrome-bottom">
      <span class="handle">${brandCopy.handle}</span>
      ${swipe}
    </footer>
  </div>
</main>
</body>
</html>`;
}
