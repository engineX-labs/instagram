/**
 * Fotogramas de control de un reel o componente:
 *   pnpm stills <CompositionId> [frames]       frames = "0,30,60" (default: 8 repartidos)
 * Guarda out/stills/<id>/<frame>.png y una hoja de contacto out/stills/<id>.png
 * (requiere ffmpeg en el PATH para la hoja). Sirve para revisar texto cortado,
 * desbordes y zonas seguras sin abrir el Studio.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [id, framesArg] = process.argv.slice(2);
if (!id) {
  console.error("Uso: pnpm stills <CompositionId> [frames separados por coma]");
  process.exit(1);
}

const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
const serveUrl = await bundle({ entryPoint: join(root, "reels/src/index.ts"), publicDir: join(root, "reels/public") });
const composition = await selectComposition({ serveUrl, id, browserExecutable, logLevel: "error" });

const n = composition.durationInFrames;
const frames = framesArg
  ? framesArg.split(",").map(Number)
  : Array.from({ length: 8 }, (_, i) => Math.round((i * (n - 1)) / 7));

const dir = join(root, "out/stills", id);
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });
for (const frame of frames) {
  const output = join(dir, `${String(frame).padStart(4, "0")}.png`);
  await renderStill({ serveUrl, composition, frame, output, browserExecutable, logLevel: "error" });
  console.log(`  frame ${frame}`);
}

// Hoja de contacto: fotogramas a 1/4 en una fila (máx. 8 por fila).
const cols = Math.min(frames.length, 8);
const rows = Math.ceil(frames.length / cols);
execFileSync("ffmpeg", [
  "-loglevel", "error", "-y", "-pattern_type", "glob", "-i", join(dir, "*.png"),
  "-vf", `scale=270:-1,pad=iw+8:ih+8:4:4:gray,tile=${cols}x${rows}`, "-frames:v", "1",
  join(root, "out/stills", `${id}.png`),
]);
console.log(`✓ out/stills/${id}.png`);
