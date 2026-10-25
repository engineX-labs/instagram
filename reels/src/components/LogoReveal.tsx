/**
 * LogoReveal: armado del logo.
 *  1. La flecha naranja se dibuja de abajo-izquierda hacia arriba-derecha (+ su punta).
 *  2. Los dos trazos blancos completan la X; aparece la estela al 40 %.
 *  3. "engine" sale desde la X hacia la izquierda (máscara + desplazamiento).
 *  4. Opcional: subtítulo y el "disparo" de la flecha del logo animado original.
 * Geometría compartida con los carruseles (tokens/logo.ts).
 */
import type React from "react";
import { useCurrentFrame } from "remotion";
import {
  brand,
  colors,
  duration,
  fontSize,
  fontWeights,
  logoLayout,
  xMark,
  X_STROKE,
  FONT_FAMILY,
  safeZone,
} from "../lib/brand.ts";

const { top, bottom, left, right } = safeZone.reel;
const safeInset = { top, bottom, left, right };
import { mix, progress } from "../lib/motion.ts";

export type LogoRevealProps = {
  /** Ancho del logo en px. */
  width?: number;
  /** Frase debajo del logo (opcional). */
  subtitle?: string;
  /** Frame del "disparo" de la flecha (como en el logo animado). Sin valor = no hay. */
  kickAt?: number;
  /** Frame de salida. Sin valor = no sale. */
  exitAt?: number;
};

type Seg = { x1: number; y1: number; x2: number; y2: number };

/** Línea que se "dibuja" según t (0→1) usando pathLength normalizado. */
const DrawLine: React.FC<{ seg: Seg; t: number; color: string }> = ({ seg, t, color }) => (
  <line
    {...seg}
    pathLength={1}
    stroke={color}
    strokeWidth={X_STROKE}
    strokeLinecap="round"
    strokeDasharray="1 1"
    strokeDashoffset={1 - t}
    // Con t=0 el cap redondo dejaría un punto visible.
    opacity={t > 0.001 ? 1 : 0}
  />
);

export const LogoReveal: React.FC<LogoRevealProps> = ({ width = 860, subtitle, kickAt, exitAt }) => {
  const frame = useCurrentFrame();
  const { viewBox: vb, word, x } = logoLayout;
  const height = (vb.height / vb.width) * width;

  // 1-2. X
  const shaft = progress(frame, 0, duration.base, "standard");
  const head = progress(frame, 9, duration.fast + 2, "enter");
  const white1 = progress(frame, 12, duration.fast, "enter");
  const white2 = progress(frame, 16, duration.fast, "enter");
  const ghost = progress(frame, 20, duration.base, "enter") * xMark.ghostOpacity;

  // 3. "engine": la máscara se abre desde la X hacia la izquierda.
  const wordT = progress(frame, 14, duration.base + 6, "enter");
  const wordLeft = word.x - 10;
  const wordRight = x.tx + 8; // borde izquierdo de la X
  const clipX = mix(wordT, wordRight, wordLeft);

  // 4. Disparo: la flecha sale ↗ y vuelve desde ↙ (mismo gesto que el SVG animado).
  let kickDx = 0;
  let kickOpacity = 1;
  if (kickAt !== undefined) {
    const out = progress(frame, kickAt, duration.fast, "exit");
    const back = progress(frame, kickAt + duration.fast, duration.base, "enter");
    if (frame < kickAt + duration.fast) {
      kickDx = mix(out, 0, 12);
      kickOpacity = 1 - out;
    } else {
      kickDx = mix(back, -12, 0);
      kickOpacity = back;
    }
  }

  const sub = subtitle ? progress(frame, 34, duration.base, "enter") : 0;
  const exit = exitAt === undefined ? 0 : progress(frame, exitAt, duration.fast, "exit");

  return (
    <div
      style={{
        position: "absolute",
        // Centrado dentro de la zona segura (no del lienzo): la banda inferior es más alta.
        ...safeInset,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: 1 - exit,
        transform: `scale(${mix(exit, 1, 0.94)})`,
      }}
    >
      <svg width={width} height={height} viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}>
        <defs>
          <clipPath id="engine-reveal">
            <rect x={clipX} y={vb.y} width={Math.max(0, wordRight - clipX)} height={vb.height} />
          </clipPath>
        </defs>
        <g clipPath="url(#engine-reveal)">
          <text
            x={word.x}
            y={word.y}
            fontFamily={`"${FONT_FAMILY}", sans-serif`}
            fontWeight={word.fontWeight}
            fontSize={word.fontSize}
            letterSpacing={word.letterSpacing}
            fill={brand.white}
            transform={`translate(${mix(wordT, 70, 0)} 0)`}
          >
            {word.text}
          </text>
        </g>
        <g transform={`translate(${x.tx} ${x.ty}) scale(${x.scale})`}>
          <g opacity={ghost} transform={`translate(${xMark.ghostOffset.x} ${xMark.ghostOffset.y})`}>
            <line {...xMark.arrowShaft} stroke={brand.orange} strokeWidth={X_STROKE} strokeLinecap="round" />
          </g>
          {/* Cada trazo blanco crece desde el centro de la X hacia afuera. */}
          <DrawLine
            seg={{ x1: 25, y1: 25, x2: 10, y2: 10 }}
            t={white1}
            color={brand.white}
          />
          <DrawLine seg={{ x1: 39, y1: 39, x2: 54, y2: 54 }} t={white2} color={brand.white} />
          <g transform={`translate(${kickDx} ${-kickDx})`} opacity={kickOpacity}>
            <DrawLine seg={xMark.arrowShaft} t={shaft} color={brand.orange} />
            <polyline
              points={xMark.arrowHead.map((p) => p.join(",")).join(" ")}
              fill="none"
              stroke={brand.orange}
              strokeWidth={X_STROKE}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - head}
              opacity={head > 0.001 ? 1 : 0}
            />
          </g>
        </g>
      </svg>
      {subtitle ? (
        <p
          style={{
            marginTop: 56,
            fontSize: fontSize.lead,
            fontWeight: fontWeights.medium,
            color: colors.textSecondary,
            opacity: sub,
            transform: `translateY(${mix(sub, 24, 0)}px)`,
            textAlign: "center",
          }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
};
