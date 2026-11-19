import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1280, height: 900 } });
test.beforeEach(async ({ page }) => page.emulateMedia({ reducedMotion: "no-preference" }));

test("opening renders real WebGL and changes the scene when scrolled", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (["error", "warning"].includes(message.type())) errors.push(message.text()); });
  await page.goto("/");
  const stage = page.locator(".stage-frame");
  try {
    await expect(stage).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
  } catch (error) {
    console.log({ errors, motion: await page.locator("#loi-moi").getAttribute("data-motion"), canvases: await stage.locator("canvas").count(), webgl2: await page.evaluate(() => Boolean(document.createElement("canvas").getContext("webgl2"))) });
    throw error;
  }
  const canvas = stage.locator("canvas");
  expect(errors.filter((message) => message.startsWith("THREE.") && /removed|deprecated|shader error/i.test(message))).toEqual([]);
  expect(await canvas.evaluate((element) => Boolean((element as HTMLCanvasElement).getContext("webgl2")))).toBe(true);
  await page.addStyleTag({ content: ".stage-content, .stage-baseline { visibility: hidden !important; }" });
  const closed = await canvas.screenshot({ path: testInfo.outputPath("curtain-closed.png") });
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * .75, behavior: "instant" }));
  await expect(page.locator(".stage-content")).toHaveCSS("opacity", "0");
  const open = await canvas.screenshot({ path: testInfo.outputPath("curtain-open.png") });
  await expect(stage).toHaveAttribute("data-renderer", "webgl");
  expect(open.equals(closed)).toBe(false);
  await page.getByRole("navigation").getByRole("link", { name: "RSVP", exact: true }).click();
  await expect(page.getByLabel("Họ và tên", { exact: true })).toBeInViewport();
});

test("reduced motion keeps a readable static opening without a WebGL canvas", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#loi-moi")).toHaveAttribute("data-motion", "static");
  await expect(page.locator(".stage-frame canvas")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("changing motion preference releases and can restore the 3D renderer", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".stage-frame")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".stage-frame canvas")).toHaveCount(0);
  await expect(page.locator("#loi-moi")).toHaveAttribute("data-motion", "static");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".stage-frame")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
});

test("unavailable WebGL retains the fallback and RSVP navigation", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { webglAttempts: number }).webglAttempts = 0;
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...options: unknown[]) {
      if (kind === "webgl2") {
        (window as unknown as { webglAttempts: number }).webglAttempts++;
        return null;
      }
      return Reflect.apply(getContext, this, [kind, ...options]);
    } as typeof getContext;
  });
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => (window as unknown as { webglAttempts: number }).webglAttempts)).toBeGreaterThan(0);
  await expect(page.locator(".stage-frame")).toHaveAttribute("data-renderer", "fallback");
  await expect(page.locator(".curtain-scene")).toBeVisible();
  await page.getByRole("navigation").getByRole("link", { name: "RSVP", exact: true }).click();
  await expect(page.getByLabel("Họ và tên", { exact: true })).toBeInViewport();
});

test("real 3D canvas fits a small phone without horizontal scrolling", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.locator(".stage-frame")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
  const canvas = page.locator(".stage-frame canvas");
  expect((await canvas.boundingBox())!.width).toBeLessThanOrEqual(375);
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * .42, behavior: "instant" }));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await canvas.screenshot({ path: testInfo.outputPath("curtain-phone.png") });
});

test("lost GPU context restores the fallback without losing invitation content", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".stage-frame")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
  await page.locator(".stage-frame canvas").evaluate((element) => {
    (element as HTMLCanvasElement).getContext("webgl2")!.getExtension("WEBGL_lose_context")!.loseContext();
  });
  await expect(page.locator(".stage-frame")).toHaveAttribute("data-renderer", "fallback");
  await expect(page.locator(".curtain-scene")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
