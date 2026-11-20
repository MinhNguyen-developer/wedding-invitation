import { expect, test } from "@playwright/test";

async function scrollToPhoto(page: import("@playwright/test").Page, index: number) {
  await page.locator(`#photo-${String(index).padStart(2, "0")}`).evaluate((element) => window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY, behavior: "instant" }));
  await expect(page.locator(".album-experience")).toHaveAttribute("data-active-photo", String(index));
}

test("standalone album animates all ten photographs through native scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/album");
  await expect(page.locator(".album-chapter")).toHaveCount(10);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Những ngày đẹp nhất.");
  await expect(page.getByText("Ảnh minh họa · Album demo")).toBeVisible();
  const experience = page.locator(".album-experience");
  await expect(experience).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
  const canvas = page.locator(".album-canvas");
  await expect(canvas).toHaveCSS("opacity", "1");
  // Isolate the GPU image so moving HTML captions cannot satisfy this proof.
  const captureScene = () => canvas.screenshot({ style: ".album-chapters, .site-nav, .album-controls, .album-demo-note { visibility: hidden !important; }" });
  let previous: Buffer | undefined;
  for (let index = 1; index <= 10; index++) {
    await scrollToPhoto(page, index);
    const current = await captureScene();
    if (previous) await expect.poll(async () => (await captureScene()).equals(previous!)).toBe(false);
    previous = current;
    await expect(page.locator(`#photo-${String(index).padStart(2, "0")} h2`)).toBeInViewport();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
});

test("direct photo fragments and keyboard scrolling preserve access back to RSVP", async ({ page }) => {
  await page.goto("/album#photo-05");
  await expect(page.locator(".album-experience")).toHaveAttribute("data-active-photo", "5");
  await expect(page.locator(".album-experience")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
  await expect.poll(() => page.locator("#photo-05").evaluate((element) =>
    Math.abs(element.getBoundingClientRect().top)
  )).toBeLessThan(2);
  await page.keyboard.press("PageDown");
  await expect(page.locator(".album-experience")).toHaveAttribute("data-active-photo", "6");
  await page.getByRole("navigation").getByRole("link", { name: "RSVP", exact: true }).click();
  await expect(page.getByLabel("Họ và tên", { exact: true })).toBeInViewport();
});

test("lost GPU reveals all HTML photo chapters without losing the current chapter", async ({ page }) => {
  await page.goto("/album");
  await expect(page.locator(".album-experience")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
  await scrollToPhoto(page, 4);
  await page.locator(".album-canvas").evaluate((canvas: HTMLCanvasElement) => canvas.getContext("webgl2")!.getExtension("WEBGL_lose_context")!.loseContext());
  await expect(page.locator(".album-experience")).toHaveAttribute("data-renderer", "fallback");
  await expect(page.locator("#photo-04 .album-photo")).toHaveCSS("opacity", "1");
  await expect(page.locator(".album-chapter img")).toHaveCount(10);
});

test("one failed photo keeps the other 3D chapters available", async ({ page }) => {
  await page.route((url) => url.href.includes("wedding-05.jpg"), (route) => route.abort());
  await page.goto("/album#photo-05");
  await expect(page.locator(".album-experience")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
  await expect(page.locator("#photo-05").getByText("Ảnh đang được cập nhật")).toBeAttached();
  await scrollToPhoto(page, 6);
  await expect(page.locator(".album-experience")).toHaveAttribute("data-renderer", "webgl");
});

test("missing GPU leaves mobile photo and caption readable", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type.startsWith("webgl")) return null;
      return Reflect.apply(original, this, [type, ...args]);
    };
  });
  await page.goto("/album#photo-10");
  await expect(page.locator(".album-experience")).toHaveAttribute("data-renderer", "fallback");
  await expect(page.locator("#photo-10 img")).toBeInViewport();
  await expect(page.locator("#photo-10 h2")).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(393);
});

test("editorial portrait retains perspective on the invitation", async ({ page }) => {
  await page.goto("/#thiep-cuoi");
  await page.locator(".editorial-portrait").first().scrollIntoViewIfNeeded();
  const portrait = page.locator(".portrait-print").first();
  const initial = await portrait.evaluate((element) => getComputedStyle(element).transform);
  await page.evaluate(() => window.scrollBy({ top: 220, behavior: "instant" }));
  await expect.poll(() => portrait.evaluate((element) => getComputedStyle(element).transform)).not.toBe(initial);
});

for (const viewport of [{ width: 768, height: 1024 }, { width: 812, height: 375 }]) {
  test(`album camera and captions fit ${viewport.width} by ${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/album");
    await expect(page.locator(".album-experience")).toHaveAttribute("data-renderer", "webgl", { timeout: 20000 });
    await scrollToPhoto(page, 3);
    const heading = page.locator("#photo-03 h2");
    await expect(heading).toBeInViewport();
    const bounds = await heading.boundingBox();
    const nav = await page.getByRole("navigation").boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(16);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width - 16);
    expect(bounds!.y).toBeGreaterThanOrEqual(nav!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
  });
}

test("rotation preserves the selected photo and its full-screen scene", async ({ page }) => {
  for (const index of [5, 10]) {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/album");
    await scrollToPhoto(page, index);
    await page.setViewportSize({ width: 852, height: 393 });
    await expect(page.locator(".album-experience")).toHaveAttribute("data-active-photo", String(index));
    await expect.poll(async () => Math.abs((await page.locator(`#photo-${String(index).padStart(2, "0")}`).boundingBox())!.y)).toBeLessThan(2);
    await expect(page.locator(`#photo-${String(index).padStart(2, "0")} h2`)).toBeInViewport();
  }
});

test("compact HTML fallback reserves separate room for the photograph and caption", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type.startsWith("webgl")) return null;
      return Reflect.apply(original, this, [type, ...args]);
    };
  });
  for (const viewport of [{ width: 375, height: 667 }, { width: 320, height: 568 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/album");
    await scrollToPhoto(page, 5);
    const photo = await page.locator("#photo-05 .album-photo").boundingBox();
    const caption = await page.locator("#photo-05 .album-chapter-copy").boundingBox();
    expect(photo!.y + photo!.height + 8).toBeLessThanOrEqual(caption!.y);
  }
});

test.describe("album without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("renders ten photos and native links to the invitation", async ({ page }) => {
    await page.goto("/album");
    await expect(page.locator(".album-chapter img")).toHaveCount(10);
    await page.goto("/album#photo-10");
    await expect(page.locator("#photo-10 img")).toBeInViewport();
    await page.getByRole("navigation").getByRole("link", { name: "Lời mời", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Quốc Minh/);
  });
});
