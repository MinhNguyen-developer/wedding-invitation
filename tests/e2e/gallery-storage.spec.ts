import { expect, test } from "@playwright/test";
import { weddingContent } from "../../lib/wedding-content";

test("all separate album photos preserve replaceable storage metadata", async ({ page }) => {
  await page.goto("/album");
  const photos = page.locator(".album-photo");
  await expect(photos).toHaveCount(10);
  for (const [index, photo] of weddingContent.gallery.entries()) {
    await expect(photos.nth(index)).toHaveAttribute("data-storage-object-path", photo.storageObjectPath);
    await expect(photos.nth(index)).toHaveAttribute("data-public-url", photo.publicUrl);
  }
  if (weddingContent.gallery[0].isDemo) await expect(page.getByText("Ảnh minh họa · Album demo")).toBeVisible();
});
