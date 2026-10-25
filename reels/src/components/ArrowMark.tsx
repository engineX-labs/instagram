/** Flecha naranja de la marca (↗ por defecto). `rotate` en grados. */
import type React from "react";
import { brand, xMark, X_STROKE } from "../lib/brand.ts";

export const ArrowMark: React.FC<{ size?: number; rotate?: number; color?: string }> = ({
  size = 64,
  rotate = 0,
  color = brand.orange,
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: "block" }} aria-hidden>
    <g transform={`rotate(${rotate} 32 32)`} stroke={color} strokeWidth={X_STROKE} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <line {...xMark.arrowShaft} />
      <polyline points={xMark.arrowHead.map((p) => p.join(",")).join(" ")} />
    </g>
  </svg>
);
