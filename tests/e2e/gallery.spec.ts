import { expect, test } from "@playwright/test";

test("invitation opens the separate album and provides a way back", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation").getByRole("link", { name: "Album", exact: true }).click();
  await expect(page).toHaveURL(/\/album$/);
  await expect(page.locator(".album-chapter")).toHaveCount(10);
  await page.getByRole("navigation").getByRole("link", { name: "Lời mời", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Quốc Minh");
  await expect(page.locator(".album-experience")).toHaveCount(0);
});
