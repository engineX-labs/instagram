/**
 * Copia los woff2 de Space Grotesk (subset latin: cubre á é í ó ú ñ ü ¿ ¡ “ ” ’)
 * desde @fontsource a assets/fonts. Se corre una sola vez o al actualizar la fuente;
 * los archivos resultantes se versionan para que el render nunca dependa de red.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fontWeights } from "../tokens/tokens.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules/@fontsource/space-grotesk");
const dest = join(root, "assets/fonts");
mkdirSync(dest, { recursive: true });

for (const weight of Object.values(fontWeights)) {
  const file = `space-grotesk-latin-${weight}-normal.woff2`;
  copyFileSync(join(src, "files", file), join(dest, file));
  console.log(`✓ ${file}`);
}
copyFileSync(join(src, "LICENSE"), join(dest, "OFL-SpaceGrotesk.txt"));
console.log("✓ OFL-SpaceGrotesk.txt");
