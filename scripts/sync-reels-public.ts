/**
 * Copia assets compartidos (fuentes) a reels/public para que Remotion los sirva
 * con staticFile(). reels/public/fonts está en .gitignore: la fuente de verdad es assets/fonts.
 */
import { cpSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "reels/public/fonts");
mkdirSync(dest, { recursive: true });
cpSync(join(root, "assets/fonts"), dest, { recursive: true });
console.log("✓ assets/fonts → reels/public/fonts");
