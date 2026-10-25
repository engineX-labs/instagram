/**
 * Render de reels: pnpm render:reel <slug>
 *   slug → composición (ver REELS). Salida: out/reels/<slug>.mp4
 *   H.264, yuv420p, 1080×1920, 30 fps, SIN pista de audio (la música se agrega en Instagram).
 *
 * Después de renderizar verifica el archivo con ffprobe (códec, tamaño, fps, sin audio).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { formats } from "../tokens/tokens.ts";

/** Registro de reels publicables: slug de archivo → id de Composition. */
const REELS: Record<string, string> = {
  "reel-01": "Reel01",
};

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2];
const id = slug ? REELS[slug] : undefined;
if (!slug || !id) {
  console.error(`Uso: pnpm render:reel <slug>   (disponibles: ${Object.keys(REELS).join(", ")})`);
  process.exit(1);
}

const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
const serveUrl = await bundle({ entryPoint: join(root, "reels/src/index.ts"), publicDir: join(root, "reels/public") });
const inputProps = { showSafeZone: false };
const composition = await selectComposition({ serveUrl, id, inputProps, browserExecutable, logLevel: "error" });

const output = join(root, "out/reels", `${slug}.mp4`);
mkdirSync(dirname(output), { recursive: true });

let last = -1;
await renderMedia({
  serveUrl,
  composition,
  inputProps,
  codec: "h264",
  pixelFormat: "yuv420p",
  crf: 16,
  imageFormat: "png",
  muted: true, // sin pista de audio
  outputLocation: output,
  browserExecutable,
  logLevel: "error",
  onProgress: ({ progress }) => {
    const pct = Math.floor(progress * 10) * 10;
    if (pct !== last) {
      last = pct;
      process.stdout.write(`  ${pct}%\n`);
    }
  },
});

// Verificación del archivo final.
const probe = JSON.parse(
  execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", output], { encoding: "utf8" }),
) as { streams: Array<Record<string, string | number>>; format: { duration: string } };
const video = probe.streams.find((s) => s.codec_type === "video");
const audio = probe.streams.filter((s) => s.codec_type === "audio");
const problems: string[] = [];
if (!video || video.codec_name !== "h264") problems.push("el video no es H.264");
if (video && (video.width !== formats.reel.width || video.height !== formats.reel.height)) problems.push("tamaño incorrecto");
if (video && video.r_frame_rate !== `${formats.reel.fps}/1`) problems.push(`fps = ${video.r_frame_rate}`);
if (audio.length) problems.push("tiene pista de audio");
if (problems.length) {
  console.error(`✗ ${output}: ${problems.join(", ")}`);
  process.exit(1);
}
console.log(`✓ out/reels/${slug}.mp4  (${Number(probe.format.duration).toFixed(2)} s, H.264 ${video?.width}×${video?.height} @ ${formats.reel.fps} fps, sin audio)`);
