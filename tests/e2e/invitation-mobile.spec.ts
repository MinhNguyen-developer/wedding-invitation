import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 } });

test("invitation remains readable on mobile", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Minh & Hà" })).toBeVisible();
  await expect(page.getByRole("link", { name: /RSVP/ })).toBeVisible();
  await expect(page.getByText("White Palace")).toBeVisible();
});
