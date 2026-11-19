import { expect, test } from "@playwright/test";
import { weddingContent } from "../../lib/wedding-content";

test("editorial anchor sits just below navigation without exposing the previous scene", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "Khám phá lời mời" }).click();
  const cover = await page.locator("#thiep-cuoi").boundingBox();
  const nav = await page.getByRole("navigation").boundingBox();
  expect(cover!.y - (nav!.y + nav!.height)).toBeGreaterThanOrEqual(0);
  expect(cover!.y - (nav!.y + nav!.height)).toBeLessThanOrEqual(40);
});

test("curtains track scrolling and the invitation remains directly reachable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const stage = page.locator("#loi-moi");
  await expect(stage).toHaveAttribute("data-motion", "enabled");
  const initial = await page.locator(".curtain-left").evaluate((element) => getComputedStyle(element).transform);
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * .5, behavior: "instant" }));
  await expect.poll(() => page.locator(".curtain-left").evaluate((element) => getComputedStyle(element).transform)).not.toBe(initial);
  await page.getByRole("navigation").getByRole("link", { name: "RSVP", exact: true }).click();
  try {
    await expect(page.getByLabel("Họ và tên", { exact: true })).toBeInViewport();
  } catch (error) {
    console.log(await page.evaluate(() => ({
      hash: location.hash, scroll: window.scrollY, viewport: [innerWidth, innerHeight],
      rsvpTop: document.querySelector("#rsvp")?.getBoundingClientRect().top,
      fieldTop: document.querySelector("#guestName")?.getBoundingClientRect().top,
      renderer: document.querySelector(".stage-frame")?.getAttribute("data-renderer")
    })));
    throw error;
  }
});

test("reduced motion removes extra scroll distance and keeps the opening readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("#loi-moi")).toHaveAttribute("data-motion", "static");
  const opening = await page.locator("#loi-moi").boundingBox();
  const frame = await page.locator(".stage-frame").boundingBox();
  expect(Math.abs(opening!.height - frame!.height)).toBeLessThan(2);
  await expect(page.getByRole("heading", { level: 1, name: weddingContent.coupleNames })).toBeVisible();
  await expect(page.locator(".stage-content")).toHaveCSS("opacity", "1");
});

for (const viewport of [{ width: 375, height: 812 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }, { width: 812, height: 375 }]) {
  test(`layout fits ${viewport.width} by ${viewport.height} and keeps focused fields below navigation`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize(viewport);
    await page.goto("/#rsvp");
    const field = page.getByLabel("Họ và tên", { exact: true });
    await expect(page.locator("#loi-moi")).toHaveAttribute("data-motion", "enabled");
    await expect(field).toBeInViewport();
    // Native smooth scrolling can still be settling when a field first enters view.
    await expect.poll(async () => {
      const section = await page.locator("#rsvp").boundingBox();
      const header = await page.getByRole("navigation").boundingBox();
      return section!.y - (header!.y + header!.height);
    }).toBeLessThanOrEqual(40);
    const section = await page.locator("#rsvp").boundingBox();
    const header = await page.getByRole("navigation").boundingBox();
    expect(section!.y).toBeGreaterThanOrEqual(header!.y + header!.height);
    await field.focus();
    await expect(field).toBeInViewport();
    const bounds = await field.boundingBox();
    const nav = await page.getByRole("navigation").boundingBox();
    expect(bounds!.y).toBeGreaterThanOrEqual(nav!.y + nav!.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test("mobile navigation offers at least 44px targets", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  for (const link of await page.getByRole("navigation").getByRole("link").all()) {
    const bounds = await link.boundingBox();
    expect(bounds!.width).toBeGreaterThanOrEqual(44);
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
  }
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("shows both scenes, event details and native links without an empty animation runway", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#loi-moi")).toHaveAttribute("data-motion", "static");
    await expect(page.getByRole("heading", { level: 1, name: weddingContent.coupleNames })).toBeVisible();
    await expect(page.getByRole("region", { name: "Thiệp cưới của Quốc Minh và Nhật Hà" })).toBeVisible();
    await expect(page.locator("#dia-diem").getByText(weddingContent.venueName)).toBeVisible();
    const opening = await page.locator("#loi-moi").boundingBox();
    const frame = await page.locator(".stage-frame").boundingBox();
    expect(Math.abs(opening!.height - frame!.height)).toBeLessThan(2);
    await page.getByRole("navigation").getByRole("link", { name: "RSVP", exact: true }).click();
    await expect(page.getByLabel("Họ và tên", { exact: true })).toBeInViewport();
  });
});
