/**
 * Hook: tipografía cinética para los primeros ~2 s.
 * Cada palabra entra (sube + aparece) escalonada; la palabra clave (*así*) entra
 * en naranja con un rebote de énfasis. Todas las palabras ocupan su lugar desde
 * el frame 0 (con opacidad 0) para que el layout no "salte" mientras entran.
 */
import type React from "react";
import { useCurrentFrame } from "remotion";
import { colors, duration, fontSize, fontWeights, letterSpacing, lineHeight, safeZone, formats, FONT_FAMILY } from "../lib/brand.ts";
import { fitSize } from "../lib/measure.ts";
import { mix, progress } from "../lib/motion.ts";
import { parseWords } from "../lib/rich.ts";
import { SafeArea } from "./Canvas.tsx";

export type HookProps = {
  /** Marcado: *énfasis*, "|" = pausa, "\n" = salto de línea. */
  text: string;
  /** Frames entre palabra y palabra. */
  wordInterval?: number;
  /** Frames que agrega cada "|". */
  pauseFrames?: number;
  /** Tamaño de letra máximo en px (se achica solo si alguna línea no entra). */
  size?: number;
  /** Frame (relativo) en el que todo sale. Sin valor = no sale. */
  exitAt?: number;
  align?: "left" | "center";
};

export const Hook: React.FC<HookProps> = ({
  text,
  wordInterval = 5,
  pauseFrames = 10,
  size = fontSize.display + 24,
  exitAt,
  align = "left",
}) => {
  const frame = useCurrentFrame();
  const words = parseWords(text, pauseFrames);

  // Las líneas las define el autor con "\n" (no hay cortes automáticos): se mide
  // cada una y se ajusta el tamaño para que la más ancha entre en la zona segura.
  const lines: string[] = [];
  words.forEach((w, i) => {
    if (i === 0 || w.lineBreakBefore) lines.push(w.text);
    else lines[lines.length - 1] += ` ${w.text}`;
  });
  const maxWidth = formats.reel.width - safeZone.reel.left - safeZone.reel.right;
  const fitted = fitSize(lines, maxWidth, {
    size,
    weight: fontWeights.bold,
    family: FONT_FAMILY,
    letterSpacingEm: parseFloat(letterSpacing.display),
  });

  // Frame de entrada de cada palabra (intervalo fijo + pausas acumuladas).
  let t = 0;
  const starts = words.map((w, i) => {
    t += (i === 0 ? 0 : wordInterval) + w.pauseBefore;
    return t;
  });

  const exit = exitAt === undefined ? 0 : progress(frame, exitAt, duration.fast, "exit");

  return (
    <SafeArea style={{ justifyContent: "center" }}>
      <p
        style={{
          fontSize: fitted,
          whiteSpace: "nowrap",
          fontWeight: fontWeights.bold,
          lineHeight: lineHeight.tight,
          letterSpacing: letterSpacing.display,
          textAlign: align,
          opacity: 1 - exit,
          transform: `translateY(${mix(exit, 0, -80)}px)`,
        }}
      >
        {words.map((w, i) => {
          const start = starts[i] ?? 0;
          const p = progress(frame, start, duration.fast + 2, "enter");
          // El énfasis usa la curva con overshoot: crece un poco de más y vuelve.
          const pe = w.emphasis ? progress(frame, start, duration.base, "emphasis") : p;
          return (
            <span key={i}>
              {w.lineBreakBefore ? <br /> : i > 0 ? " " : null}
              <span
                style={{
                  display: "inline-block",
                  color: w.emphasis ? colors.accent : colors.text,
                  opacity: p,
                  transform: w.emphasis
                    ? `translateY(${mix(p, 60, 0)}px) scale(${mix(pe, 0.7, 1)})`
                    : `translateY(${mix(p, 60, 0)}px)`,
                  transformOrigin: "left bottom",
                }}
              >
                {w.text}
              </span>
            </span>
          );
        })}
      </p>
    </SafeArea>
  );
};
