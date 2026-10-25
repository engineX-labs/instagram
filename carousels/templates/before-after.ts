/**
 * Antes / después: cada estado es una slide (al deslizar se "pasa" de uno a otro).
 * Antes: apagado, con cruces grises. Después: naranja, con tildes.
 */
import { iconSvg } from "../../tokens/icons.ts";
import { rich } from "../lib/text.ts";
import type { SlideOf, TemplateOutput } from "../lib/types.ts";

export function beforeAfter(slide: SlideOf<"before-after">): TemplateOutput {
  const after = slide.state === "after";
  const label = after ? "Después" : "Antes";
  const mark = iconSvg(after ? "check" : "cross", 56, "mark");
  return {
    body: `
      <p class="tag ${slide.state}">${label}</p>
      <h2 class="h1">${rich(slide.title)}</h2>
      ${
        slide.points?.length
          ? `<ul class="points">${slide.points.map((p) => `<li>${mark}<span>${rich(p)}</span></li>`).join("")}</ul>`
          : ""
      }`,
    css: `
      .before-after .tag {
        align-self: flex-start;
        font-size: var(--text-small); font-weight: var(--weight-bold);
        letter-spacing: var(--tracking-label); text-transform: uppercase;
        padding: var(--space-1) var(--space-3); border-radius: var(--radius-pill);
        margin-bottom: var(--space-5);
      }
      .before-after .tag.before { color: var(--color-text-secondary); border: 3px solid var(--color-line); }
      .before-after .tag.after { color: var(--color-on-accent); background: var(--color-accent); }
      .before-after .h1 { max-width: 920px; }
      .before-after.state-before .h1 { color: var(--color-text-secondary); }
      .before-after .points { list-style: none; margin-top: var(--space-6); display: grid; gap: var(--space-4); }
      .before-after .points li {
        display: flex; align-items: center; gap: var(--space-3);
        font-size: var(--text-lead); line-height: var(--leading-snug);
      }
      .before-after .mark { flex: none; }
      .before-after.state-before .mark { color: var(--color-text-muted); }
      .before-after.state-before .points li { color: var(--color-text-secondary); }
      .before-after.state-after .mark { color: var(--color-accent); }`,
  };
}
