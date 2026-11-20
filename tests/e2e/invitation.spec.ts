import { expect, test } from "@playwright/test";
import { weddingContent } from "../../lib/wedding-content";

test("guest can read Vietnamese invitation details across the two scenes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: weddingContent.coupleNames })).toBeVisible();
  await expect(page.getByText("Trân trọng kính mời")).toBeVisible();
  await expect(page.getByRole("region", { name: "Thiệp cưới của Quốc Minh và Nhật Hà" })).toBeVisible();
  await expect(page.getByText(weddingContent.weddingDate).first()).toBeVisible();
  await expect(page.locator("#dia-diem").getByText(weddingContent.weddingTime)).toBeVisible();
  await expect(page.locator("#dia-diem").getByText(weddingContent.venueName)).toBeVisible();
});
