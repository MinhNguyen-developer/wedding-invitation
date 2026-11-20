import { expect, test } from "@playwright/test";
import { weddingContent } from "../../lib/wedding-content";

test.use({ viewport: { width: 375, height: 812 } });

test("invitation stays readable and RSVP stays reachable on a small phone", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: weddingContent.coupleNames })).toBeInViewport();
  await page.getByRole("navigation").getByRole("link", { name: "RSVP", exact: true }).click();
  await expect(page.getByLabel("Họ và tên", { exact: true })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
