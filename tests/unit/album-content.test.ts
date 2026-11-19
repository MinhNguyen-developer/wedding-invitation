import { expect, it } from "vitest";
import { weddingContent } from "@/lib/wedding-content";

it("provides ten individually replaceable photos for the standalone album", () => {
  expect(weddingContent.gallery).toHaveLength(10);
  expect(new Set(weddingContent.gallery.map((photo) => photo.publicUrl)).size).toBe(10);
  expect(weddingContent.gallery.map((photo) => photo.storageObjectPath)).toEqual(Array.from({ length: 10 }, (_, index) => `photo-${String(index + 1).padStart(2, "0")}.jpg`));
});
