/** Portada: un título enorme, nada más. */
import { rich } from "../lib/text.ts";
import type { Slide } from "../lib/types.ts";

export function cover(slide: Extract<Slide, { type: "cover" }>): { body: string; css: string } {
  return {
    body: `
      ${slide.kicker ? `<p class="kicker">${rich(slide.kicker)}</p>` : ""}
      <h1 class="display">${rich(slide.title)}</h1>`,
    css: `
      .cover .body { justify-content: flex-end; padding-bottom: var(--space-8); }
      .cover .kicker { margin-bottom: var(--space-4); }
      .cover .display { max-width: 900px; }`,
  };
}
