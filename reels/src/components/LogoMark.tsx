/** Logo estático (engine + X) en React, con la geometría de tokens/logo.ts. */
import type React from "react";
import { brand, logoLayout, xMark, X_STROKE, FONT_FAMILY } from "../lib/brand.ts";

export const XMarkGroup: React.FC<{ ghost?: boolean }> = ({ ghost = true }) => {
  const line = (s: { x1: number; y1: number; x2: number; y2: number }, color: string) => (
    <line {...s} stroke={color} strokeWidth={X_STROKE} strokeLinecap="round" />
  );
  return (
    <>
      {ghost ? (
        <g opacity={xMark.ghostOpacity} transform={`translate(${xMark.ghostOffset.x} ${xMark.ghostOffset.y})`}>
          {line(xMark.arrowShaft, brand.orange)}
        </g>
      ) : null}
      {xMark.whiteSegments.map((s, i) => (
        <g key={i}>{line(s, brand.white)}</g>
      ))}
      {line(xMark.arrowShaft, brand.orange)}
      <polyline
        points={xMark.arrowHead.map((p) => p.join(",")).join(" ")}
        fill="none"
        stroke={brand.orange}
        strokeWidth={X_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
};

export const LogoMark: React.FC<{ width?: number }> = ({ width = 420 }) => {
  const { viewBox: vb, word, x } = logoLayout;
  return (
    <svg width={width} height={(vb.height / vb.width) * width} viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}>
      <text
        x={word.x}
        y={word.y}
        fontFamily={`"${FONT_FAMILY}", sans-serif`}
        fontWeight={word.fontWeight}
        fontSize={word.fontSize}
        letterSpacing={word.letterSpacing}
        fill={brand.white}
      >
        {word.text}
      </text>
      <g transform={`translate(${x.tx} ${x.ty}) scale(${x.scale})`}>
        <XMarkGroup />
      </g>
    </svg>
  );
};
