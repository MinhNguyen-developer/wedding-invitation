import { describe, expect, it } from "vitest";
import { createGalleryMediaItems, galleryMediaSchema, isManagedStorageUrl } from "@/lib/gallery-media-schema";

describe("gallery media schema", () => {
  it("builds sorted public URLs from a Supabase Storage base URL", () => {
    const items = createGalleryMediaItems(
      [
        {
          storageObjectPath: "photo-02.jpg",
          localFallbackPath: "/images/pre-wedding/pre-wedding-02.svg",
          altText: "Ảnh thứ hai",
          caption: "Hai",
          displayOrder: 2
        },
        {
          storageObjectPath: "photo-01.jpg",
          localFallbackPath: "/images/pre-wedding/pre-wedding-01.svg",
          altText: "Ảnh thứ nhất",
          caption: "Một",
          displayOrder: 1
        }
      ],
      "https://project-ref.supabase.co/storage/v1/object/public/pre-wedding/"
    );

    expect(items.map((item) => item.storageObjectPath)).toEqual(["photo-01.jpg", "photo-02.jpg"]);
    expect(items[0].publicUrl).toBe(
      "https://project-ref.supabase.co/storage/v1/object/public/pre-wedding/photo-01.jpg"
    );
    expect(isManagedStorageUrl(items[0].publicUrl)).toBe(true);
  });

  it("uses local fallback paths when storage is not configured", () => {
    const items = createGalleryMediaItems([
      {
        storageObjectPath: "photo-01.jpg",
        localFallbackPath: "/images/pre-wedding/pre-wedding-01.svg",
        altText: "Ảnh thứ nhất",
        caption: "Một",
        displayOrder: 1
      }
    ]);

    expect(items[0].publicUrl).toBe("/images/pre-wedding/pre-wedding-01.svg");
    expect(isManagedStorageUrl(items[0].publicUrl)).toBe(false);
  });

  it("rejects unsafe or incomplete gallery metadata", () => {
    const parsed = galleryMediaSchema.safeParse({
      publicUrl: "",
      storageObjectPath: "../photo.jpg",
      altText: "",
      displayOrder: 1.5
    });

    expect(parsed.success).toBe(false);
  });
});
