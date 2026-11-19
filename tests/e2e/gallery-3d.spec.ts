import { expect, test } from "@playwright/test";

test("demo album renders real 3D and rotates photos through keyboard controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#album");
  const album = page.locator(".gallery-renderer");
  await expect(album).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
  await expect(page.getByText("Ảnh minh họa · Album demo")).toBeVisible();
  const canvas = album.locator("canvas");
  await expect(canvas).toHaveCSS("opacity", "1");
  const first = await canvas.screenshot();
  const next = page.getByRole("button", { name: "Xem ảnh tiếp theo" });
  await next.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#album").getByRole("status")).toContainText("Ảnh 2 trên");
  await expect.poll(async () => (await canvas.screenshot()).equals(first)).toBe(false);
  await next.click();
  await next.click();
  await expect(page.locator("#album").getByRole("status")).toContainText("Ảnh 1 trên");
  await page.getByRole("button", { name: "Xem ảnh trước" }).click();
  await expect(page.locator("#album").getByRole("status")).toContainText("Ảnh 3 trên");
  const viewport = page.viewportSize()!;
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
});

test("album falls back to usable photos when GPU context is lost", async ({ page }) => {
  await page.goto("/#album");
  const album = page.locator(".gallery-renderer");
  await expect(album).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
  await album.locator("canvas").evaluate((canvas: HTMLCanvasElement) => canvas.getContext("webgl2")!.getExtension("WEBGL_lose_context")!.loseContext());
  await expect(album).toHaveAttribute("data-renderer", "fallback");
  await expect(album.locator("img").first()).toBeVisible();
  await page.getByRole("button", { name: "Xem ảnh tiếp theo" }).click();
  await expect(page.locator("#album").getByRole("status")).toContainText("Ảnh 2 trên");
});

test("album perspective follows scroll and photographs can be swiped", async ({ page }) => {
  await page.goto("/#album");
  const album = page.locator(".gallery-renderer");
  await expect(album).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
  const canvas = album.locator("canvas");
  await expect(canvas).toHaveCSS("opacity", "1");
  const first = await canvas.screenshot();
  await page.evaluate(() => window.scrollBy({ top: 80, behavior: "instant" }));
  await expect.poll(async () => (await canvas.screenshot()).equals(first)).toBe(false);
  const viewport = await album.locator(".gallery-viewport").boundingBox();
  await page.mouse.move(viewport!.x + viewport!.width * .8, viewport!.y + viewport!.height * .5);
  await page.mouse.down();
  await page.mouse.move(viewport!.x + viewport!.width * .2, viewport!.y + viewport!.height * .5, { steps: 12 });
  await page.mouse.up();
  await expect(page.locator("#album").getByRole("status")).not.toContainText("Ảnh 1 trên");
});

test("failed album texture keeps HTML image errors and navigation usable", async ({ page }) => {
  const failed = page.waitForEvent("console", (message) => message.type() === "warning" && message.text().includes("Wedding 3D shader preparation failed"));
  await page.route("**/images/demo/wedding-02.jpg", (route) => route.abort());
  await page.goto("/#album");
  await failed;
  await expect(page.locator(".gallery-renderer")).toHaveAttribute("data-renderer", "fallback");
  await page.getByRole("button", { name: "Xem ảnh tiếp theo" }).click();
  await expect(page.locator("#album").getByRole("status")).toContainText("Ảnh 2 trên");
});

test("editorial portrait changes its 3D perspective when scrolled", async ({ page }) => {
  await page.goto("/#thiep-cuoi");
  await page.locator(".editorial-portrait").scrollIntoViewIfNeeded();
  const portrait = page.locator(".portrait-print");
  await expect(portrait).toBeInViewport();
  const first = await portrait.evaluate((element) => getComputedStyle(element).transform);
  await page.evaluate(() => window.scrollBy({ top: 220, behavior: "instant" }));
  await expect.poll(() => portrait.evaluate((element) => getComputedStyle(element).transform)).not.toBe(first);
  await expect(page.locator(".portrait-demo-label")).toHaveText("Ảnh minh họa");
});

test("mobile HTML fallback keeps photo captions fully inside the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type === "webgl2" || type === "webgl") return null;
      return Reflect.apply(getContext, this, [type, ...args]);
    };
  });
  await page.goto("/#album");
  const viewport = page.locator(".gallery-viewport");
  await viewport.scrollIntoViewIfNeeded();
  await expect(page.locator(".gallery-renderer")).toHaveAttribute("data-renderer", "fallback");
  const bounds = await viewport.boundingBox();
  const caption = await viewport.locator("figcaption").first().boundingBox();
  expect(caption!.y).toBeGreaterThanOrEqual(bounds!.y);
  expect(caption!.y + caption!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height + 1);
});

test.describe("album without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("shows all demo photographs and keeps native RSVP access", async ({ page }) => {
    await page.goto("/#album");
    const images = page.locator("#album img");
    await expect(images).toHaveCount(3);
    for (const image of await images.all()) await expect(image).toBeVisible();
    await page.getByRole("navigation").getByRole("link", { name: "RSVP", exact: true }).click();
    await expect(page.getByLabel("Họ và tên", { exact: true })).toBeInViewport();
  });
});
