/**
 * Render de carruseles: pnpm render:carousel <slug>
 *
 * Lee carousels/posts/<slug>.json, arma el HTML de cada slide con su plantilla y
 * la captura a PNG 1080×1350 en out/carousels/<slug>/01.png, 02.png, ...
 *
 * Antes de capturar verifica, por slide:
 *  - reglas tipográficas del texto (comillas, ¿¡, emojis),
 *  - que Space Grotesk esté cargada (si no, el PNG saldría con la fuente fallback),
 *  - que ningún elemento se salga de la zona segura ni tenga texto desbordado.
 * Si algo falla, no escribe nada y sale con código 1.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { formats } from "../tokens/tokens.ts";
import { typographyIssues } from "./lib/text.ts";
import type { Post, Slide, SlideContext } from "./lib/types.ts";
import { layout } from "./templates/layout.ts";
import { cover } from "./templates/cover.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Plantilla por tipo de slide. */
function renderBody(slide: Slide, _ctx: SlideContext): { body: string; css: string } {
  switch (slide.type) {
    case "cover":
      return cover(slide);
    default:
      throw new Error(`Plantilla "${slide.type}" todavía no implementada`);
  }
}

/** Todo el texto visible de una slide (para el control tipográfico). */
function visibleText(slide: Slide): string[] {
  return Object.values(slide).flatMap((v) =>
    typeof v === "string" ? [v] : Array.isArray(v) ? v.filter((x) => typeof x === "string") : [],
  );
}

async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error("Uso: pnpm render:carousel <slug>   (ver carousels/posts/)");
    process.exit(1);
  }
  const post: Post = JSON.parse(readFileSync(join(root, "carousels/posts", `${slug}.json`), "utf8"));

  // 1) Tipografía: se valida todo antes de abrir el navegador.
  const textErrors = post.slides.flatMap((s, i) =>
    visibleText(s).flatMap((t) => typographyIssues(t).map((e) => `slide ${i + 1}: ${e} → “${t}”`)),
  );
  if (textErrors.length) {
    console.error(`✗ Problemas tipográficos en ${slug}.json:\n  ${textErrors.join("\n  ")}`);
    process.exit(1);
  }

  const outDir = join(root, "out/carousels", slug);
  const htmlDir = join(outDir, "_html"); // HTML intermedio, útil para depurar en un navegador
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(htmlDir, { recursive: true });

  const styles = {
    tokens: pathToFileURL(join(root, "tokens/tokens.css")).href,
    base: pathToFileURL(join(root, "carousels/templates/base.css")).href,
  };

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: formats.carousel.width, height: formats.carousel.height },
    deviceScaleFactor: 1,
  });

  const errors: string[] = [];
  const total = post.slides.length;
  for (const [i, slide] of post.slides.entries()) {
    const ctx: SlideContext = { index: i + 1, total, isLast: i === total - 1 };
    const { body, css } = renderBody(slide, ctx);
    const html = layout({ ctx, variant: slide.type, body, css, styles });
    const name = String(ctx.index).padStart(2, "0");
    const htmlPath = join(htmlDir, `${name}.html`);
    writeFileSync(htmlPath, html);

    await page.goto(pathToFileURL(htmlPath).href);
    // 2) Fuente cargada de verdad (no fallback). Chromium solo descarga los pesos
    //    que se usan, así que se fuerza la carga de todos y se verifica cada uno.
    const fontErr = await page.evaluate(async () => {
      const faces = [...document.fonts].filter((f) => f.family.includes("Space Grotesk"));
      const results = await Promise.allSettled(faces.map((f) => f.load()));
      if (faces.length === 0) return "no hay @font-face de Space Grotesk";
      const failed = results.filter((r) => r.status === "rejected").length;
      return failed ? `${failed} peso(s) de Space Grotesk no cargaron` : null;
    });
    if (fontErr) errors.push(`${name}: ${fontErr}`);

    // 3) Desborde: cada elemento dentro de .safe debe quedar dentro de su caja,
    //    y ningún bloque de texto debe tener contenido recortado.
    const overflow = await page.evaluate(() => {
      const safe = document.querySelector(".safe")!.getBoundingClientRect();
      const bad: string[] = [];
      // Los hijos de <svg> se omiten: su caja incluye el em-box aunque el viewBox recorte.
      for (const el of document.querySelectorAll<HTMLElement>(".safe *:not(svg *)")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        const tol = 0.5;
        if (r.left < safe.left - tol || r.right > safe.right + tol || r.top < safe.top - tol || r.bottom > safe.bottom + tol) {
          bad.push(`<${el.tagName.toLowerCase()} class="${el.getAttribute("class") ?? ""}"> fuera de la zona segura`);
        }
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== "visible") {
          bad.push(`<${el.tagName.toLowerCase()}> texto recortado`);
        }
      }
      return bad;
    });
    errors.push(...overflow.map((e) => `${name}: ${e}`));

    await page.screenshot({ path: join(outDir, `${name}.png`), type: "png" });
    console.log(`  ${name}.png  (${slide.type})`);
  }
  await browser.close();

  if (errors.length) {
    console.error(`\n✗ ${errors.length} problema(s):\n  ${errors.join("\n  ")}`);
    process.exit(1);
  }
  console.log(`✓ ${total} slides → out/carousels/${slug}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
