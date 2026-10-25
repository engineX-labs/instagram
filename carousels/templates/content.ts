/** Contenido: ícono propio en naranja + un solo mensaje grande. */
import { iconSvg } from "../../tokens/icons.ts";
import { rich } from "../lib/text.ts";
import type { SlideOf, TemplateOutput } from "../lib/types.ts";

export function content(slide: SlideOf<"content">): TemplateOutput {
  return {
    body: `
      ${slide.icon ? iconSvg(slide.icon, 144) : ""}
      <h2 class="h1">${rich(slide.title)}</h2>
      ${slide.body ? `<p class="lead">${rich(slide.body)}</p>` : ""}`,
    css: `
      .content .icon { color: var(--color-accent); margin-bottom: var(--space-6); }
      .content .h1 { max-width: 900px; }
      .content .lead { margin-top: var(--space-5); max-width: 860px; }`,
  };
}
