import { chromium, expect } from "@playwright/test";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// Regenerate whenever the opening scene's geometry, lighting or camera changes.
const browser = await chromium.launch();
try {
  await mkdir("public/images/stage", { recursive: true });
  for (const [name, width, height] of [["desktop", 1660, 885], ["portrait", 393, 852]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto(`${process.argv[2] || "http://127.0.0.1:3001"}/`);
    await expect(page.locator(".stage-frame")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
    const png = await page.locator(".stage-canvas").screenshot({
      style: ".stage-content, .stage-baseline, .site-nav, .stage-world, .curtain-scene, nextjs-portal { visibility: hidden !important; }"
    });
    await sharp(png).webp({ lossless: true }).toFile(`public/images/stage/closed-${name}.webp`);
    await page.close();
    console.log(`Rendered ${name} curtain poster (${width}×${height}).`);
  }
} finally {
  await browser.close();
}
