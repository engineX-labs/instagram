/**
 * Lienzo base de todo reel: fondo de marca + tipografía. Con `showSafeZone`
 * dibuja las zonas inseguras de Instagram (solo para revisar en Studio).
 */
import type React from "react";
import { AbsoluteFill } from "remotion";
import { colors, FONT_FAMILY, safeZone } from "../lib/brand.ts";

export const Canvas: React.FC<{ children?: React.ReactNode; showSafeZone?: boolean }> = ({
  children,
  showSafeZone = false,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: colors.bg,
      color: colors.text,
      fontFamily: `"${FONT_FAMILY}", sans-serif`,
      fontKerning: "normal",
    }}
  >
    {children}
    {showSafeZone ? <SafeZoneOverlay /> : null}
  </AbsoluteFill>
);

/** Rellena con rayas las zonas tapadas por la UI de Instagram. */
const SafeZoneOverlay: React.FC = () => {
  const { top, bottom, left, right } = safeZone.reel;
  const hatch = "repeating-linear-gradient(45deg, rgba(255,0,80,0.28) 0 12px, transparent 12px 24px)";
  const band = (style: React.CSSProperties) => (
    <div style={{ position: "absolute", background: hatch, ...style }} />
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {band({ top: 0, left: 0, right: 0, height: top })}
      {band({ bottom: 0, left: 0, right: 0, height: bottom })}
      {band({ top, bottom, left: 0, width: left })}
      {band({ top, bottom, right: 0, width: right })}
    </AbsoluteFill>
  );
};

/** Caja posicionada dentro de la zona segura del reel. */
export const SafeArea: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => {
  const { top, bottom, left, right } = safeZone.reel;
  return (
    <div style={{ position: "absolute", top, bottom, left, right, display: "flex", flexDirection: "column", ...style }}>
      {children}
    </div>
  );
};
