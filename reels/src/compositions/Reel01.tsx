/**
 * Reel #1 — presentación de marca. 15 s = 450 frames = 30 beats a 120 BPM.
 * Todos los cortes caen en un beat para que cualquier tema de 120 BPM de la
 * biblioteca de Instagram calce (y en múltiplos de 2 beats para temas de 60/240).
 *
 *   beat  0– 4  (0–2 s)   Hook
 *   beat  4–12  (2–6 s)   LogoReveal
 *   beat 12–24  (6–12 s)  4 ejemplos × 3 beats (1,5 s c/u)
 *   beat 24–30  (12–15 s) Outro
 *
 * Sin audio: se exporta mudo y la música se agrega en Instagram.
 */
import type React from "react";
import { Sequence, useCurrentFrame } from "remotion";
import { colors, duration, fontSize, fontWeights, letterSpacing, lineHeight } from "../lib/brand.ts";
import { beats, mix, progress } from "../lib/motion.ts";
import { parseWords } from "../lib/rich.ts";
import { Canvas, SafeArea } from "../components/Canvas.tsx";
import { Hook } from "../components/Hook.tsx";
import { LogoReveal } from "../components/LogoReveal.tsx";
import { PhoneMockup } from "../components/PhoneMockup.tsx";
import { Outro } from "../components/Outro.tsx";
import { reel01, type Reel01Example } from "./reel01.data.ts";

/** Plan de tiempos en beats → frames. Única fuente para Sequence y duración total. */
export const REEL01_TIMING = {
  hook: { from: beats(0), dur: beats(4) },
  logo: { from: beats(4), dur: beats(8) },
  examples: { from: beats(12), each: beats(3) },
  outro: { from: beats(24), dur: beats(6) },
} as const;
export const REEL01_DURATION = beats(30);

export type Reel01Props = { showSafeZone?: boolean };

export const Reel01: React.FC<Reel01Props> = ({ showSafeZone = false }) => {
  const t = REEL01_TIMING;
  return (
    <Canvas showSafeZone={showSafeZone}>
      <Sequence from={t.hook.from} durationInFrames={t.hook.dur} name="Hook">
        <Hook text={reel01.hook} wordInterval={5} pauseFrames={5} exitAt={t.hook.dur - duration.fast} />
      </Sequence>
      <Sequence from={t.logo.from} durationInFrames={t.logo.dur} name="LogoReveal">
        <LogoReveal subtitle={reel01.logoSubtitle} kickAt={beats(5)} exitAt={t.logo.dur - duration.fast} />
      </Sequence>
      {reel01.examples.map((ex, i) => (
        <Sequence
          key={ex.label}
          from={t.examples.from + i * t.examples.each}
          durationInFrames={t.examples.each}
          name={`Ejemplo ${i + 1}: ${ex.label}`}
        >
          <Example example={ex} index={i} total={reel01.examples.length} length={t.examples.each} />
        </Sequence>
      ))}
      <Sequence from={t.outro.from} durationInFrames={t.outro.dur} name="Outro">
        <Outro cta={reel01.outroCta} />
      </Sequence>
    </Canvas>
  );
};

/** Un ejemplo: contador + frase arriba, teléfono que entra desde la derecha y sale. */
const Example: React.FC<{ example: Reel01Example; index: number; total: number; length: number }> = ({
  example,
  index,
  total,
  length,
}) => {
  const frame = useCurrentFrame();
  const textIn = progress(frame, 0, duration.fast, "enter");
  const textOut = progress(frame, length - duration.instant - 2, duration.instant + 2, "exit");
  const words = parseWords(example.title, 0);

  return (
    <SafeArea style={{ alignItems: "center", justifyContent: "flex-start" }}>
      <div
        style={{
          alignSelf: "stretch",
          opacity: textIn * (1 - textOut),
          transform: `translateY(${mix(textIn, 30, 0)}px)`,
          minHeight: 300,
        }}
      >
        <p
          style={{
            fontSize: fontSize.caption,
            fontWeight: fontWeights.medium,
            letterSpacing: letterSpacing.label,
            color: colors.textMuted,
            fontVariantNumeric: "tabular-nums",
            marginTop: 24,
          }}
        >
          {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </p>
        <p
          style={{
            marginTop: 16,
            fontSize: fontSize.h2,
            fontWeight: fontWeights.bold,
            lineHeight: lineHeight.snug,
            letterSpacing: letterSpacing.title,
            textWrap: "balance",
          }}
        >
          {words.map((w, i) => (
            <span key={i} style={{ color: w.emphasis ? colors.accent : colors.text }}>
              {i > 0 ? " " : ""}
              {w.text}
            </span>
          ))}
        </p>
      </div>
      <div style={{ marginTop: 40 }}>
        <PhoneMockup
          src={example.capture}
          placeholderLabel={example.label}
          placeholderIcon={example.icon}
          width={500}
          from="right"
          enterAt={0}
          exitAt={length - duration.instant - 2}
        />
      </div>
    </SafeArea>
  );
};
