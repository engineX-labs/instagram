/**
 * Esquema del JSON de cada post (carousels/posts/<slug>.json).
 * Marcado de texto: *palabra* → se pinta en naranja (énfasis). Nada más.
 */
export type Slide =
  | { type: "cover"; title: string; kicker?: string }
  | { type: "content"; title: string; body?: string }
  | { type: "list-item"; number: number; total: number; title: string; body?: string }
  | { type: "before-after"; label: "antes" | "después"; title: string; points: string[] }
  | { type: "cta"; title: string; body?: string; action: string };

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
