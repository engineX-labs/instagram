/**
 * Carga Space Grotesk desde reels/public/fonts (sin CDN). loadFont usa delayRender,
 * así que Remotion no captura ningún fotograma hasta que las 3 variantes estén listas.
 */
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { fontWeights } from "../../../tokens/tokens.ts";

export const FONT_FAMILY = "Space Grotesk";

export const fontsReady = Promise.all(
  Object.values(fontWeights).map((weight) =>
    loadFont({
      family: FONT_FAMILY,
      url: staticFile(`fonts/space-grotesk-latin-${weight}-normal.woff2`),
      weight: String(weight),
      format: "woff2",
    }),
  ),
);
