/**
 * Config de Remotion (CLI y Studio). Se lee desde la raíz del repo.
 * Entry: reels/src/index.ts · Public: reels/public (fuentes copiadas con `pnpm sync:reels`).
 */
import { Config } from "@remotion/cli/config";

Config.setEntryPoint("reels/src/index.ts");
Config.setPublicDir("reels/public");
Config.setVideoImageFormat("png"); // fotogramas sin pérdida antes de codificar H.264
Config.setPixelFormat("yuv420p"); // compatibilidad con Instagram / todos los reproductores
Config.setCodec("h264");
Config.setCrf(16); // alta calidad: Instagram recomprime igual
Config.setOverwriteOutput(true);

// Por defecto Remotion descarga su propio Chrome Headless Shell. En entornos sin
// acceso a esa descarga (CI, sandbox) se puede apuntar a uno ya instalado.
const browser = process.env.REMOTION_BROWSER_EXECUTABLE;
if (browser) Config.setBrowserExecutable(browser);
