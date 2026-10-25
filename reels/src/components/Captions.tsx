/**
 * Captions: subtítulos palabra por palabra a partir de un JSON de Whisper.
 * Muestra una "página" (hasta N palabras) a la vez; la palabra que se está
 * diciendo va en naranja. Se ubican justo arriba de la zona segura inferior.
 */
import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fontSize, fontWeights, letterSpacing, radius, safeZone } from "../lib/brand.ts";
import { paginate, wordsFromWhisper } from "../lib/whisper.ts";

export type CaptionsProps = {
  /** JSON de Whisper ya parseado (ver lib/whisper.ts). */
  whisper: Parameters<typeof wordsFromWhisper>[0];
  maxWords?: number;
  /** Distancia extra sobre la zona segura inferior, en px. */
  lift?: number;
  /** Fondo detrás del texto (útil sobre mockups o video). */
  plate?: boolean;
};

export const Captions: React.FC<CaptionsProps> = ({ whisper, maxWords = 4, lift = 80, plate = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const { words, segmentEnds } = wordsFromWhisper(whisper);
  const pages = paginate(words, segmentEnds, { maxWords });
  // Página visible: la que contiene `t` (entre el inicio de su 1.ª palabra y el fin de la última).
  const page = pages.find((p) => t >= p[0]!.start && t <= p[p.length - 1]!.end);
  if (!page) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: safeZone.reel.left,
        right: safeZone.reel.right,
        bottom: safeZone.reel.bottom + lift,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          fontSize: fontSize.h3,
          fontWeight: fontWeights.bold,
          letterSpacing: letterSpacing.title,
          lineHeight: 1.15,
          textAlign: "center",
          ...(plate ? { background: "rgba(14,17,22,0.85)", padding: "16px 28px", borderRadius: radius.md } : {}),
        }}
      >
        {page.map((w, i) => {
          const active = t >= w.start && t <= w.end;
          const spoken = t > w.end;
          return (
            <span
              key={i}
              style={{
                color: active ? colors.accent : spoken ? colors.text : colors.textSecondary,
                display: "inline-block",
                transform: active ? "scale(1.06)" : "none",
                margin: "0 0.16em",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </p>
    </div>
  );
};
