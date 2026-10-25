/**
 * Esquema del JSON de cada post (carousels/posts/<slug>.json).
 * Marcado de texto: *palabra* → se pinta en naranja (énfasis). Nada más.
 */
import type { IconName } from "../../tokens/icons.ts";

export type Slide =
  /** Portada: título enorme. */
  | { type: "cover"; title: string; kicker?: string }
  /** Un mensaje: ícono opcional + título + texto corto opcional. */
  | { type: "content"; title: string; body?: string; icon?: IconName }
  /** Ítem de una lista numerada (una señal por slide). */
  | { type: "list-item"; number: number; title: string; body?: string }
  /** Mitad de una comparación: estado "antes" o "después". */
  | { type: "before-after"; state: "before" | "after"; title: string; points?: string[] }
  /** Título + 2-4 puntos cortos. */
  | { type: "points"; title: string; points: string[] }
  /** Cierre con llamado a la acción. */
  | { type: "cta"; title: string; body?: string; action: string };

export type SlideType = Slide["type"];
export type SlideOf<T extends SlideType> = Extract<Slide, { type: T }>;

export interface Post {
  /** Debe coincidir con el nombre del archivo. */
  slug: string;
  /** Solo referencia interna (no se renderiza). */
  name: string;
  slides: Slide[];
}

/** Lo que recibe cada plantilla además de su slide. */
export interface SlideContext {
  index: number; // 1-based
  total: number;
  isLast: boolean;
}

/** Salida de una plantilla: HTML del área central + CSS propio. */
export interface TemplateOutput {
  body: string;
  css: string;
}
