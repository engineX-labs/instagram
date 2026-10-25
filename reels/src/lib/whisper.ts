/**
 * Normaliza timestamps de Whisper a palabras con tiempos en segundos.
 *
 * Formato soportado: JSON de openai-whisper / faster-whisper con word timestamps
 *   { "segments": [ { "start", "end", "text", "words": [ { "word", "start", "end" } ] } ] }
 * (comando en el README: --word_timestamps True --output_format json).
 */
export interface CaptionWord {
  text: string;
  start: number; // s
  end: number; // s
}

interface WhisperJson {
  segments: Array<{ start: number; end: number; words?: Array<{ word: string; start: number; end: number }> }>;
}

export function wordsFromWhisper(json: WhisperJson): { words: CaptionWord[]; segmentEnds: number[] } {
  const words: CaptionWord[] = [];
  const segmentEnds: number[] = [];
  for (const seg of json.segments) {
    if (!seg.words?.length) {
      throw new Error("El JSON de Whisper no tiene 'words': correlo con --word_timestamps True");
    }
    for (const w of seg.words) {
      const text = w.word.trim(); // Whisper antepone un espacio a cada palabra
      if (text) words.push({ text, start: w.start, end: w.end });
    }
    segmentEnds.push(words.length); // índice de corte al final del segmento
  }
  return { words, segmentEnds };
}

/**
 * Agrupa palabras en "páginas" de subtítulo: corta al llegar a `maxWords`,
 * al final de cada segmento de Whisper o ante un silencio largo.
 */
export function paginate(
  words: CaptionWord[],
  segmentEnds: number[],
  { maxWords = 4, maxGap = 0.6 } = {},
): CaptionWord[][] {
  const pages: CaptionWord[][] = [];
  let page: CaptionWord[] = [];
  const ends = new Set(segmentEnds);
  words.forEach((w, i) => {
    const prev = words[i - 1];
    if (page.length && (page.length >= maxWords || ends.has(i) || (prev && w.start - prev.end > maxGap))) {
      pages.push(page);
      page = [];
    }
    page.push(w);
  });
  if (page.length) pages.push(page);
  return pages;
}
