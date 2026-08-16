import { expect, test } from "@playwright/test";

test("guest can navigate the pre-wedding gallery", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Album/ }).click();

  await expect(page.getByRole("heading", { name: "Những khoảnh khắc thương yêu" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ảnh tiếp theo" })).toBeVisible();
  await page.getByRole("button", { name: "Ảnh tiếp theo" }).click();
  await expect(page.getByText("Một lời hẹn")).toBeVisible();
});
