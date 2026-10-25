/** Ítem de lista numerada: número gigante en naranja + la idea. */
import { rich } from "../lib/text.ts";
import type { SlideOf, TemplateOutput } from "../lib/types.ts";

export function listItem(slide: SlideOf<"list-item">): TemplateOutput {
  const n = String(slide.number).padStart(2, "0");
  return {
    body: `
      <p class="num">${n}</p>
      <h2 class="h2">${rich(slide.title)}</h2>
      ${slide.body ? `<p class="lead">${rich(slide.body)}</p>` : ""}`,
    css: `
      .list-item .num {
        font-size: 220px; font-weight: var(--weight-bold); line-height: 0.9;
        letter-spacing: var(--tracking-display); color: var(--color-accent);
        font-variant-numeric: tabular-nums; margin-bottom: var(--space-6);
      }
      .list-item .h2 { max-width: 920px; }
      .list-item .lead { margin-top: var(--space-4); }`,
  };
}
