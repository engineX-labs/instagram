/**
 * BeforeAfter: el estado "antes" (apagado, con cruces) se barre de izquierda a
 * derecha con una línea naranja que revela el "después" (con tildes en naranja).
 */
import type React from "react";
import { useCurrentFrame } from "remotion";
import { colors, duration, fontSize, fontWeights, letterSpacing, lineHeight, radius, safeZone } from "../lib/brand.ts";
import { mix, progress } from "../lib/motion.ts";
import { Icon } from "./Icon.tsx";

export type BeforeAfterState = {
  title: string;
  points?: string[];
};

export type BeforeAfterProps = {
  before: BeforeAfterState;
  after: BeforeAfterState;
  /** Frame en que empieza el barrido. */
  wipeAt?: number;
  /** Duración del barrido en frames. */
  wipeDuration?: number;
};

const Panel: React.FC<{ state: BeforeAfterState; kind: "before" | "after"; enter: number }> = ({
  state,
  kind,
  enter,
}) => {
  const after = kind === "after";
  const { top, bottom, left, right } = safeZone.reel;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: after ? colors.bg : colors.surface,
        padding: `${top}px ${right}px ${bottom}px ${left}px`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          alignSelf: "flex-start",
          fontSize: fontSize.small,
          fontWeight: fontWeights.bold,
          letterSpacing: letterSpacing.label,
          textTransform: "uppercase",
          padding: "8px 24px",
          borderRadius: radius.pill,
          marginBottom: 48,
          ...(after
            ? { background: colors.accent, color: colors.onAccent }
            : { border: `3px solid ${colors.line}`, color: colors.textSecondary }),
        }}
      >
        {after ? "Después" : "Antes"}
      </p>
      <h2
        style={{
          fontSize: fontSize.h1,
          fontWeight: fontWeights.bold,
          lineHeight: lineHeight.snug,
          letterSpacing: letterSpacing.title,
          color: after ? colors.text : colors.textSecondary,
          textWrap: "balance",
        }}
      >
        {state.title}
      </h2>
      {state.points?.length ? (
        <ul style={{ listStyle: "none", marginTop: 64, display: "grid", gap: 32 }}>
          {state.points.map((p, i) => {
            const t = Math.min(1, Math.max(0, enter * 3 - i * 0.6));
            return (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  fontSize: fontSize.lead,
                  color: after ? colors.text : colors.textSecondary,
                  opacity: t,
                  transform: `translateX(${mix(t, -30, 0)}px)`,
                }}
              >
                <Icon name={after ? "check" : "cross"} size={60} color={after ? colors.accent : colors.textMuted} />
                {p}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export const BeforeAfter: React.FC<BeforeAfterProps> = ({ before, after, wipeAt = 45, wipeDuration = duration.slow }) => {
  const frame = useCurrentFrame();
  const wipe = progress(frame, wipeAt, wipeDuration, "standard");
  const beforeIn = progress(frame, 0, duration.slow, "enter");
  const afterIn = progress(frame, wipeAt + wipeDuration * 0.6, duration.slow, "enter");
  const x = wipe * 100; // % del ancho ya barrido

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Panel state={after} kind="after" enter={afterIn} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${x}%)` }}>
        <Panel state={before} kind="before" enter={beforeIn} />
      </div>
      {wipe > 0 && wipe < 1 ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${x}%`,
            width: 10,
            marginLeft: -5,
            background: colors.accent,
            boxShadow: `0 0 60px ${colors.accent}`,
          }}
        />
      ) : null}
    </div>
  );
};
