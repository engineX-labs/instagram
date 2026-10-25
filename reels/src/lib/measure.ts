/**
 * Medición de texto con canvas (sin caché a propósito: el primer render puede
 * ocurrir antes de que cargue la fuente; los fotogramas capturados ya la tienen).
 */
let ctx: CanvasRenderingContext2D | null = null;

export function textWidth(text: string, { size, weight, family, letterSpacingEm = 0 }: {
  size: number;
  weight: number;
  family: string;
  letterSpacingEm?: number;
}): number {
  ctx ??= document.createElement("canvas").getContext("2d");
  if (!ctx) return 0;
  ctx.font = `${weight} ${size}px "${family}"`;
  ctx.letterSpacing = `${letterSpacingEm * size}px`;
  return ctx.measureText(text).width;
}

/** Tamaño máximo (≤ `size`) para que la línea más ancha entre en `maxWidth`. */
export function fitSize(lines: string[], maxWidth: number, opts: Omit<Parameters<typeof textWidth>[1], "size"> & { size: number }): number {
  const widest = Math.max(...lines.map((l) => textWidth(l, opts)));
  return widest > maxWidth ? Math.floor(opts.size * (maxWidth / widest)) : opts.size;
}
