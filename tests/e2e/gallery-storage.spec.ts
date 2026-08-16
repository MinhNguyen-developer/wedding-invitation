import { expect, test } from "@playwright/test";

test("gallery exposes managed storage metadata for approved pre-wedding images", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Album/ }).click();

  const firstGalleryItem = page.locator("[data-storage-object-path]").first();
  await expect(firstGalleryItem).toHaveAttribute("data-storage-object-path", "photo-01.jpg");

  const publicUrl = await firstGalleryItem.getAttribute("data-public-url");
  expect(publicUrl).toBeTruthy();

  if (process.env.NEXT_PUBLIC_SUPABASE_STORAGE_PUBLIC_BASE_URL) {
    expect(publicUrl).toContain(".supabase.co/storage/v1/object/public/pre-wedding/photo-01.jpg");
  } else {
    expect(publicUrl).toBe("/images/pre-wedding/pre-wedding-01.svg");
  }
});
