import { expect, test } from "@playwright/test";

test("guest can read Vietnamese invitation details", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Minh & Hà" })).toBeVisible();
  await expect(page.getByText("Trân trọng kính mời")).toBeVisible();
  await expect(page.getByText("Chủ Nhật, 24 tháng 11 năm 2026")).toBeVisible();
  await expect(page.getByText("17:30")).toBeVisible();
  await expect(page.getByText("White Palace")).toBeVisible();
});
