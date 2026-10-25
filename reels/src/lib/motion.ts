/** Helpers de animación basados en los tokens de movimiento. */
import { Easing, interpolate } from "remotion";
import { easing, rhythm } from "../../../tokens/tokens.ts";

type Curve = keyof typeof easing;

/** Función de easing de Remotion a partir del token. */
export const ease = (curve: Curve) => {
  const [x1, y1, x2, y2] = easing[curve];
  return Easing.bezier(x1, y1, x2, y2);
};

/**
 * Progreso 0→1 entre `start` y `start + duration` (en frames), con la curva dada.
 * Fuera del rango se clampa.
 */
export function progress(frame: number, start: number, duration: number, curve: Curve = "enter"): number {
  return interpolate(frame, [start, start + duration], [0, 1], {
    easing: ease(curve),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

/** Mapea un progreso 0→1 a un rango [a, b]. */
export const mix = (t: number, a: number, b: number) => a + (b - a) * t;

/** Beats → frames (120 BPM a 30 fps → 15 frames por beat). */
export const beats = (n: number) => Math.round(n * rhythm.framesPerBeat);
