import { expect, test } from "@playwright/test";
import sharp from "sharp";

test.use({ viewport: { width: 1660, height: 885 }, deviceScaleFactor: 1 });

test("route changes always keep a visible photo or rendered scene", async ({ page }) => {
  await page.addInitScript(() => {
    const state = { gaps: [] as { path: string; canvas: number; fallback: number }[], samples: 0 };
    Object.assign(window, { handoffProbe: state });
    const measure = () => {
      const root = document.querySelector(location.pathname === "/album" ? ".album-experience" : ".stage-frame");
      const canvas = root?.querySelector("canvas");
      const fallback = root?.querySelector(location.pathname === "/album" ? ".album-chapter-visual" : ".stage-fallback, .curtain-scene");
      if (!root || !fallback || !canvas) return;
      const ready = root.getAttribute("data-renderer") === "webgl";
      const canvasOpacity = ready ? Number(getComputedStyle(canvas).opacity) : 0;
      const fallbackOpacity = getComputedStyle(fallback).visibility === "hidden" ? 0 : Number(getComputedStyle(fallback).opacity);
      state.samples++;
      if (Math.max(canvasOpacity, fallbackOpacity) < .98) state.gaps.push({ path: location.pathname, canvas: canvasOpacity, fallback: fallbackOpacity });
    };
    new MutationObserver(measure).observe(document, { subtree: true, attributes: true, attributeFilter: ["data-renderer"] });
    function sample() { measure(); requestAnimationFrame(sample); }
    requestAnimationFrame(sample);
  });
  await page.goto("/");
  for (let index = 0; index < 3; index++) {
    await expect(page.locator(".stage-frame")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
    await page.getByRole("navigation").getByRole("link", { name: "Album", exact: true }).click();
    await expect(page.locator(".album-experience")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
    await expect(page.locator(".album-chapter-visual").first()).toHaveCSS("opacity", "0");
    await page.getByRole("navigation").getByRole("link", { name: "Lời mời", exact: true }).click();
  }
  const result = await page.evaluate(() => (window as unknown as { handoffProbe: { samples: number; gaps: unknown[] } }).handoffProbe);
  expect(result.samples).toBeGreaterThan(5);
  expect(result.gaps).toEqual([]);
});

test("curtain transition never reveals the monogram through the closed fabric", async ({ page }) => {
  await page.addInitScript(() => {
    new MutationObserver((records) => {
      for (const record of records) {
        const target = record.target as Element;
        if (!target.matches?.('.stage-frame[data-renderer="webgl"]')) continue;
        for (const element of target.querySelectorAll(".stage-fallback, .stage-world, .curtain-scene")) {
          for (const animation of element.getAnimations()) {
            animation.pause();
            animation.currentTime = Number(animation.effect!.getTiming().duration) / 2;
          }
        }
      }
    }).observe(document, { attributes: true, subtree: true, attributeFilter: ["data-renderer"] });
  });
  await page.goto("/");
  await expect(page.locator(".stage-frame")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
  const options = { style: ".stage-content, .stage-baseline, .site-nav, nextjs-portal { visibility:hidden !important; }" };
  const middle = await page.locator(".stage-frame").screenshot(options);
  await page.locator(".stage-frame").evaluate((element) => element.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
  const final = await page.locator(".stage-frame").screenshot(options);
  const crop = { left: 580, top: 220, width: 500, height: 450 };
  const a = await sharp(middle).extract(crop).removeAlpha().raw().toBuffer();
  const b = await sharp(final).extract(crop).removeAlpha().raw().toBuffer();
  let difference = 0;
  for (let index = 0; index < a.length; index++) difference += Math.abs(a[index] - b[index]);
  expect(difference / a.length).toBeLessThan(2);
});

test("album reacts to pointer movement over its visible content", async ({ page }) => {
  await page.goto("/album");
  await expect(page.locator(".album-experience")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
  await expect(page.locator(".album-chapter-visual").first()).toHaveCSS("opacity", "0");
  const canvas = page.locator(".album-canvas");
  await expect(canvas).toHaveCSS("opacity", "1");
  const options = { style: ".album-chapters, .site-nav, .album-demo-note { visibility:hidden !important; }" };
  const before = await canvas.screenshot(options);
  await page.mouse.move(850, 300);
  await page.mouse.move(1440, 650, { steps: 10 });
  await expect.poll(async () => (await canvas.screenshot(options)).equals(before)).toBe(false);
});

for (const viewport of [{ width: 1660, height: 885 }, { width: 1920, height: 932 }, { width: 393, height: 852 }]) {
  test(`the first album scene starts from the complete visible preview without a flash at ${viewport.width}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    let releaseTexture!: () => void;
    const textureGate = new Promise<void>((resolve) => { releaseTexture = resolve; });
    await page.route((url) => url.pathname.endsWith("wedding-10.jpg"), async (route) => {
      await textureGate;
      await route.continue();
    });
    await page.addInitScript(() => {
      new MutationObserver((records) => {
        for (const record of records) {
          const root = record.target as Element;
          if (!root.matches?.('.album-experience[data-renderer="webgl"]')) continue;
          for (const visual of root.querySelectorAll(".album-chapter-visual")) {
            for (const animation of visual.getAnimations()) {
              animation.pause();
              animation.currentTime = 0;
            }
          }
        }
      }).observe(document, { subtree: true, attributes: true, attributeFilter: ["data-renderer"] });
    });
    await page.goto("/album", { waitUntil: "domcontentloaded" });
    const photo = page.locator(".album-photo").first();
    await expect(photo).toHaveCSS("transform", "none");
    await expect.poll(() => photo.locator("img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    const before = await page.screenshot({ path: testInfo.outputPath("preview.png") });
    releaseTexture();
    await expect(page.locator(".album-experience")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
    const firstFrame = await page.screenshot({ path: testInfo.outputPath("first-frame.png") });
    await page.locator(".album-experience").evaluate((root) => root.getAnimations({ subtree: true }).forEach((animation) => {
      animation.currentTime = Number(animation.effect!.getTiming().duration) / 2;
    }));
    const middle = await page.screenshot({ path: testInfo.outputPath("middle.png") });
    await page.locator(".album-experience").evaluate((root) => root.getAnimations({ subtree: true }).forEach((animation) => animation.finish()));
    const complete = await page.screenshot({ path: testInfo.outputPath("complete.png") });
    for (const [name, body] of [["preview", before], ["first-frame", firstFrame], ["middle", middle], ["complete", complete]] as const) {
      await testInfo.attach(name, { body, contentType: "image/png" });
    }
    const initialPixels = await sharp(before).removeAlpha().raw().toBuffer();
    const firstPixels = await sharp(firstFrame).removeAlpha().raw().toBuffer();
    const middlePixels = await sharp(middle).removeAlpha().raw().toBuffer();
    const finalPixels = await sharp(complete).removeAlpha().raw().toBuffer();
    let firstChange = 0;
    let middleChange = 0;
    let remainingChange = 0;
    let totalChange = 0;
    for (let index = 0; index < initialPixels.length; index++) {
      firstChange += Math.abs(initialPixels[index] - firstPixels[index]);
      middleChange += Math.abs(initialPixels[index] - middlePixels[index]);
      remainingChange += Math.abs(middlePixels[index] - finalPixels[index]);
      totalChange += Math.abs(initialPixels[index] - finalPixels[index]);
    }
    expect(totalChange / initialPixels.length).toBeGreaterThan(2);
    expect(firstChange / initialPixels.length).toBeLessThan(1);
    expect(middleChange).toBeGreaterThan(totalChange * .1);
    expect(middleChange).toBeLessThan(totalChange * .95);
    expect(remainingChange).toBeLessThan(totalChange * .95);
  });
}

test("album fallback keeps the photograph aligned with the first GPU frame", async ({ browser }) => {
  const viewport = { width: 1660, height: 885 };
  const normal = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await normal.goto("/album");
  await expect(normal.locator(".album-experience")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
  const hideCopy = { style: ".album-title, .album-chapter-copy, .site-nav, .album-demo-note, .album-scroll-hint, nextjs-portal { visibility:hidden !important; }" };
  const rendered = await normal.screenshot(hideCopy);
  await normal.close();
  const fallback = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  await fallback.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      return type.startsWith("webgl") ? null : Reflect.apply(original, this, [type, ...args]);
    };
  });
  await fallback.goto("/album");
  const photo = fallback.locator(".album-photo").first();
  await expect(photo).toHaveCSS("transform", "none");
  await expect.poll(() => photo.locator("img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const staticFrame = await fallback.screenshot(hideCopy);
  const crop = { left: 790, top: 260, width: 560, height: 350 };
  const a = await sharp(rendered).extract(crop).removeAlpha().raw().toBuffer();
  const b = await sharp(staticFrame).extract(crop).removeAlpha().raw().toBuffer();
  let difference = 0;
  for (let index = 0; index < a.length; index++) difference += Math.abs(a[index] - b[index]);
  expect(difference / a.length).toBeLessThan(10);
  await fallback.close();
});

for (const viewport of [{ width: 1660, height: 885 }, { width: 393, height: 852 }]) {
  test(`closed curtain fallback matches its rendered scene at ${viewport.width}`, async ({ browser }) => {
    const normal = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await normal.goto("/");
    await expect(normal.locator(".stage-frame")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
    const hideCopy = { style: ".stage-content, .stage-baseline, .site-nav, nextjs-portal { visibility:hidden !important; }" };
    const rendered = await normal.locator(".stage-frame").screenshot(hideCopy);
    await normal.close();
    const fallback = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await fallback.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
        return type.startsWith("webgl") ? null : Reflect.apply(original, this, [type, ...args]);
      };
    });
    await fallback.goto("/");
    await expect(fallback.locator("#loi-moi")).toHaveAttribute("data-motion", "enabled");
    const staticFrame = await fallback.locator(".stage-frame").screenshot(hideCopy);
    const a = await sharp(rendered).removeAlpha().raw().toBuffer();
    const b = await sharp(staticFrame).removeAlpha().raw().toBuffer();
    expect(a.length).toBe(b.length);
    let difference = 0;
    for (let index = 0; index < a.length; index++) difference += Math.abs(a[index] - b[index]);
    expect(difference / a.length).toBeLessThan(6);
    await fallback.close();
  });
}

test("desktop album title stays balanced over two lines", async ({ page }) => {
  await page.goto("/album");
  const lines = await page.locator(".album-title h1").evaluate((heading) => heading.clientHeight / parseFloat(getComputedStyle(heading).lineHeight));
  expect(lines).toBeLessThan(2.1);
});
