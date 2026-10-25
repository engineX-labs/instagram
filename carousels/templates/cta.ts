/** Cierre: pregunta/frase grande + botón visual hacia el mensaje directo. */
import { arrowSvg } from "../../tokens/logo.ts";
import { rich } from "../lib/text.ts";
import type { SlideOf, TemplateOutput } from "../lib/types.ts";

export function cta(slide: SlideOf<"cta">): TemplateOutput {
  return {
    body: `
      <h2 class="display">${rich(slide.title)}</h2>
      ${slide.body ? `<p class="lead">${rich(slide.body)}</p>` : ""}
      <p class="action">${rich(slide.action)} ${arrowSvg({ size: 56, color: "currentColor" })}</p>`,
    css: `
      .cta .body { justify-content: flex-end; padding-bottom: var(--space-7); }
      .cta .display { font-size: var(--text-h1); max-width: 940px; }
      .cta .lead { margin-top: var(--space-4); }
      .cta .action {
        align-self: flex-start; margin-top: var(--space-7);
        display: flex; align-items: center; gap: var(--space-3);
        background: var(--color-accent); color: var(--color-on-accent);
        font-size: var(--text-body); font-weight: var(--weight-bold);
        padding: var(--space-3) var(--space-5); border-radius: var(--radius-pill);
      }`,
  };
}
