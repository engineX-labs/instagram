/** Portada: un título enorme abajo, todo el resto es aire. */
import { rich } from "../lib/text.ts";
import type { SlideOf, TemplateOutput } from "../lib/types.ts";

export function cover(slide: SlideOf<"cover">): TemplateOutput {
  return {
    body: `
      ${slide.kicker ? `<p class="kicker">${rich(slide.kicker)}</p>` : ""}
      <h1 class="display">${rich(slide.title)}</h1>`,
    css: `
      .cover .body { justify-content: flex-end; padding-bottom: var(--space-8); }
      .cover .kicker { margin-bottom: var(--space-4); }
      .cover .display { max-width: 920px; }`,
  };
}
