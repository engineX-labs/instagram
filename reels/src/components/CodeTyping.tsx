/**
 * CodeTyping: bloque de código que se escribe solo, con resaltado en colores de marca
 * y cursor naranja que parpadea al ritmo (1 beat).
 */
import type React from "react";
import { useCurrentFrame } from "remotion";
import { colors, fontFamily, fontSize, fontWeights, radius, rhythm, syntax, duration } from "../lib/brand.ts";
import { highlight } from "../lib/highlight.ts";
import { mix, progress } from "../lib/motion.ts";

export type CodeTypingProps = {
  code: string;
  /** Nombre de archivo en la barra superior. */
  filename?: string;
  /** Caracteres por frame. */
  speed?: number;
  /** Frame en que empieza a escribir (la ventana entra antes). */
  typeAt?: number;
  size?: number;
  width?: number;
};

export const CodeTyping: React.FC<CodeTypingProps> = ({
  code,
  filename,
  speed = 1.6,
  typeAt = duration.base,
  size = fontSize.small + 4,
  width = 880,
}) => {
  const frame = useCurrentFrame();
  const tokens = highlight(code);
  const shown = Math.max(0, Math.floor((frame - typeAt) * speed));
  const typing = shown < code.length;
  // Mientras escribe, el cursor queda fijo; al terminar parpadea medio beat on/off.
  const cursorOn = typing || Math.floor(frame / (rhythm.framesPerBeat / 2)) % 2 === 0;

  const enter = progress(frame, 0, duration.base, "enter");

  // Corta los tokens en el carácter `shown`.
  let budget = shown;
  const visible = tokens.flatMap((t, i) => {
    if (budget <= 0) return [];
    const text = t.text.slice(0, budget);
    budget -= text.length;
    return [
      <span key={i} style={{ color: syntax[t.kind] }}>
        {text}
      </span>,
    ];
  });

  return (
    <div
      style={{
        width,
        borderRadius: radius.lg,
        background: colors.surface,
        border: `3px solid ${colors.line}`,
        overflow: "hidden",
        opacity: enter,
        transform: `translateY(${mix(enter, 80, 0)}px)`,
        boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "22px 32px",
          borderBottom: `3px solid ${colors.line}`,
          background: colors.surfaceRaised,
        }}
      >
        {[colors.accent, colors.line, colors.line].map((c, i) => (
          <span key={i} style={{ width: 20, height: 20, borderRadius: radius.pill, background: c }} />
        ))}
        {filename ? (
          <span style={{ marginLeft: 16, fontSize: fontSize.caption, color: colors.textMuted, fontWeight: fontWeights.medium }}>
            {filename}
          </span>
        ) : null}
      </div>
      <pre
        style={{
          margin: 0,
          padding: "36px 40px 44px",
          fontFamily: fontFamily.code,
          fontVariantNumeric: "tabular-nums",
          fontSize: size,
          lineHeight: 1.45,
          fontWeight: fontWeights.medium,
          whiteSpace: "pre-wrap",
          color: syntax.plain,
          // Reserva el alto final para que la ventana no crezca mientras escribe.
          minHeight: `calc(${code.split("\n").length} * ${size * 1.45}px + 80px)`,
        }}
      >
        {visible}
        <span
          style={{
            display: "inline-block",
            width: size * 0.55,
            height: size * 1.1,
            marginLeft: 2,
            verticalAlign: "text-bottom",
            background: colors.accent,
            opacity: cursorOn ? 1 : 0,
          }}
        />
      </pre>
    </div>
  );
};
