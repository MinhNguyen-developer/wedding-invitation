import { expect, test } from "@playwright/test";
import { weddingContent } from "../../lib/wedding-content";

test("gallery keeps managed photo metadata without displaying temporary artwork as photography", async ({ page }) => {
  await page.goto("/#album");
  if (await page.locator(".gallery-slide").count() === 0) {
    await expect(page.locator("#album img")).toHaveCount(0);
    await expect(page.getByText("Những bức hình sẽ sớm có mặt.")).toBeVisible();
  } else {
    const first = page.locator("[data-storage-object-path]").first();
    await expect(first).toHaveAttribute("data-storage-object-path", weddingContent.gallery[0].storageObjectPath);
    await expect(first).toHaveAttribute("data-public-url", new RegExp(`${weddingContent.gallery[0].storageObjectPath.replace(".", "\\.")}$`));
  }
});
