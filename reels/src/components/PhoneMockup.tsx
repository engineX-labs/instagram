/**
 * PhoneMockup: marco de celular genérico (sin marca) con una captura adentro.
 * - `src`: imagen o video en reels/public (ej. "captures/stock.mp4"). Se detecta por extensión.
 * - Sin `src`: placeholder rayado y CLARAMENTE rotulado "CAPTURA PENDIENTE",
 *   para no dibujar interfaces falsas.
 * Entra desde abajo con un spring y una leve rotación.
 */
import type React from "react";
import { Img, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { IconName } from "../../../tokens/icons.ts";
import { colors, fontSize, fontWeights, letterSpacing, radius, springs, duration } from "../lib/brand.ts";
import { mix, progress } from "../lib/motion.ts";
import { Icon } from "./Icon.tsx";

export type PhoneMockupProps = {
  /** Ruta dentro de reels/public. */
  src?: string;
  /** Texto del placeholder (qué captura va acá). */
  placeholderLabel?: string;
  /** Ícono del placeholder. */
  placeholderIcon?: IconName;
  /** Ancho del teléfono en px (alto = ancho × 2.05). */
  width?: number;
  /** Frame de entrada (relativo a la Sequence). */
  enterAt?: number;
  /** Frame de salida. Sin valor = no sale. */
  exitAt?: number;
  /** Lado desde el que entra. */
  from?: "bottom" | "right";
};

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;
const BEZEL = 18;

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  src,
  placeholderLabel = "Captura",
  placeholderIcon,
  width = 600,
  enterAt = 0,
  exitAt,
  from = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const height = Math.round(width * 2.05);

  const enter = spring({ frame: frame - enterAt, fps, config: springs.snappy });
  const exit = exitAt === undefined ? 0 : progress(frame, exitAt, duration.fast, "exit");

  const offset = mix(enter, 1, 0) * 700 + exit * 700;
  const transform =
    from === "bottom"
      ? `translateY(${offset}px) rotate(${mix(enter, -6, 0)}deg)`
      : `translateX(${offset}px) rotate(${mix(enter, 6, 0)}deg)`;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius.phone,
        background: colors.surfaceRaised,
        border: `3px solid ${colors.line}`,
        padding: BEZEL,
        position: "relative",
        transform,
        opacity: Math.min(1, enter * 2) * (1 - exit),
        boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: radius.phone - BEZEL,
          overflow: "hidden",
          background: colors.surface,
        }}
      >
        {src ? (
          VIDEO_EXT.test(src) ? (
            <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )
        ) : (
          <Placeholder label={placeholderLabel} icon={placeholderIcon} />
        )}
        {/* Isla superior genérica */}
        <div
          style={{
            position: "absolute",
            top: 22,
            left: "50%",
            width: width * 0.28,
            height: 34,
            marginLeft: -(width * 0.28) / 2,
            borderRadius: radius.pill,
            background: colors.bg,
          }}
        />
      </div>
    </div>
  );
};

const Placeholder: React.FC<{ label: string; icon?: IconName }> = ({ label, icon }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 28,
      background: `repeating-linear-gradient(135deg, ${colors.surface} 0 22px, ${colors.surfaceRaised} 22px 44px)`,
      textAlign: "center",
      padding: 40,
    }}
  >
    {icon ? <Icon name={icon} size={140} color={colors.accent} /> : null}
    <p style={{ fontSize: fontSize.h3, fontWeight: fontWeights.bold, letterSpacing: letterSpacing.title }}>{label}</p>
    <p
      style={{
        fontSize: fontSize.caption,
        fontWeight: fontWeights.bold,
        letterSpacing: letterSpacing.label,
        textTransform: "uppercase",
        color: colors.onAccent,
        background: colors.accent,
        padding: "8px 18px",
        borderRadius: radius.pill,
      }}
    >
      Captura pendiente
    </p>
  </div>
);
