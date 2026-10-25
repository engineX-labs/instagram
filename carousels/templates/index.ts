/** Registro: tipo de slide → plantilla. */
import type { Slide, TemplateOutput } from "../lib/types.ts";
import { cover } from "./cover.ts";
import { content } from "./content.ts";
import { listItem } from "./list-item.ts";
import { beforeAfter } from "./before-after.ts";
import { points } from "./points.ts";
import { cta } from "./cta.ts";

export function renderSlide(slide: Slide): TemplateOutput {
  switch (slide.type) {
    case "cover":
      return cover(slide);
    case "content":
      return content(slide);
    case "list-item":
      return listItem(slide);
    case "before-after":
      return beforeAfter(slide);
    case "points":
      return points(slide);
    case "cta":
      return cta(slide);
  }
}

/** Clase(s) extra de .slide por tipo (p. ej. estado antes/después). */
export function slideVariant(slide: Slide): string {
  return slide.type === "before-after" ? `before-after state-${slide.state}` : slide.type;
}
