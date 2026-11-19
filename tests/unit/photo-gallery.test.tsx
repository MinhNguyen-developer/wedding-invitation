import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PhotoGallery } from "@/components/photo-gallery";
import { weddingContent } from "@/lib/wedding-content";
import { renderWithProviders } from "./test-utils";

vi.mock("@/lib/wedding-content", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/wedding-content")>();
  return {
    ...original,
    weddingContent: {
      ...original.weddingContent,
      gallery: original.weddingContent.gallery.map((photo) => ({ ...photo, publicUrl: `https://example.com/${photo.storageObjectPath}` }))
    }
  };
});

vi.mock("embla-carousel-react", () => ({
  default: () => [vi.fn(), { selectedScrollSnap: () => 0, on: vi.fn(), off: vi.fn(), scrollPrev: vi.fn(), scrollNext: vi.fn() }]
}));

const realPhotos = weddingContent.gallery.map((photo) => ({ ...photo }));
beforeEach(() => weddingContent.gallery.splice(0, weddingContent.gallery.length, ...realPhotos.map((photo) => ({ ...photo }))));

describe("PhotoGallery", () => {
  it("renders real photos in managed order with captions, metadata and accessible controls", () => {
    renderWithProviders(<PhotoGallery />);
    for (const photo of weddingContent.gallery) {
      const image = screen.getByAltText(photo.altText);
      expect(image).toHaveAttribute("src", photo.publicUrl);
      expect(image.closest("figure")).toHaveAttribute("data-storage-object-path", photo.storageObjectPath);
      expect(image.closest("figure")).toHaveAttribute("data-public-url", photo.publicUrl);
      expect(screen.getByText(photo.caption!)).toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: "Xem ảnh trước" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Xem ảnh tiếp theo" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Ảnh 1 trên 3: Ngày nắng dịu");
  });

  it("shows an honest empty state instead of presenting placeholder artwork as wedding photos", () => {
    weddingContent.gallery.forEach((photo, index) => { photo.publicUrl = `/images/pre-wedding/pre-wedding-0${index + 1}.svg`; });
    renderWithProviders(<PhotoGallery />);
    expect(screen.getByText("Những bức hình sẽ sớm có mặt.")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Xem ảnh tiếp theo" })).not.toBeInTheDocument();
  });

  it("retains the caption and navigation when a real photo fails to load", () => {
    renderWithProviders(<PhotoGallery />);
    fireEvent.error(screen.getByAltText(weddingContent.gallery[0].altText));
    expect(screen.getByText("Ảnh chưa tải được")).toBeInTheDocument();
    expect(screen.getByText(weddingContent.gallery[0].caption!)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Xem ảnh tiếp theo" })).toBeInTheDocument();
  });
});
