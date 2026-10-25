/** Parser del mini-marcado de textos: *énfasis*, "|" = pausa, "\n" = salto de línea. */

export interface Word {
  text: string;
  emphasis: boolean;
  /** Frames extra de pausa ANTES de esta palabra (acumulados por cada "|"). */
  pauseBefore: number;
  /** Esta palabra empieza una línea nueva. */
  lineBreakBefore: boolean;
}

/**
 * "Si se puede pensar, | lo *construimos.*" → palabras con metadatos.
 * El énfasis puede abarcar varias palabras: "*sin planillas.*".
 */
export function parseWords(input: string, pauseFrames: number): Word[] {
  const words: Word[] = [];
  let emphasis = false;
  let pending = 0;
  let lineBreak = false;
  for (const line of input.split("\n")) {
    if (words.length) lineBreak = true;
    for (const raw of line.split(/\s+/).filter(Boolean)) {
      if (raw === "|") {
        pending += pauseFrames;
        continue;
      }
      const opens = raw.startsWith("*");
      const closes = raw.endsWith("*") && raw.length > 1;
      if (opens) emphasis = true;
      words.push({
        text: raw.replace(/\*/g, ""),
        emphasis,
        pauseBefore: pending,
        lineBreakBefore: lineBreak,
      });
      if (closes) emphasis = false;
      pending = 0;
      lineBreak = false;
    }
  }
  return words;
}
