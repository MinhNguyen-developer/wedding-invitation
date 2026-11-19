import { expect, test } from "@playwright/test";

test("gallery presents approved photos or a clear preparation message", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation").getByRole("link", { name: "Album", exact: true }).click();
  await expect(page.locator("#gallery-title")).toBeVisible();
  if (await page.locator(".gallery-slide").count() === 0) {
    await expect(page.getByText("Những bức hình sẽ sớm có mặt.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Xem ảnh tiếp theo" })).toHaveCount(0);
  } else {
    const position = page.locator("#album").getByRole("status");
    await expect(position).toContainText("Ảnh 1 trên");
    await page.getByRole("button", { name: "Xem ảnh tiếp theo" }).click();
    await expect(position).toContainText("Ảnh 2 trên");
  }
});
