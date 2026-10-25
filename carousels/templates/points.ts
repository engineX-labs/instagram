/** Título + puntos cortos, cada uno con la flecha de la marca como viñeta. */
import { arrowSvg } from "../../tokens/logo.ts";
import { rich } from "../lib/text.ts";
import type { SlideOf, TemplateOutput } from "../lib/types.ts";

export function points(slide: SlideOf<"points">): TemplateOutput {
  return {
    body: `
      <h2 class="h2">${rich(slide.title)}</h2>
      <ul class="points">
        ${slide.points.map((p) => `<li>${arrowSvg({ size: 64 })}<span>${rich(p)}</span></li>`).join("")}
      </ul>`,
    css: `
      .points .h2 { color: var(--color-text-secondary); margin-bottom: var(--space-7); }
      .points ul.points { list-style: none; display: grid; gap: var(--space-6); }
      .points ul.points li {
        display: flex; align-items: center; gap: var(--space-4);
        font-size: var(--text-h1); font-weight: var(--weight-bold);
        line-height: var(--leading-tight); letter-spacing: var(--tracking-title);
      }
      .points ul.points .arrow { flex: none; }`,
  };
}
