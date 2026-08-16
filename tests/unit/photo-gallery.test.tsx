import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PhotoGallery } from "@/components/photo-gallery";
import { weddingContent } from "@/lib/wedding-content";
import { renderWithProviders } from "./test-utils";

vi.mock("embla-carousel-react", () => ({
  default: () => [
    vi.fn(),
    {
      selectedScrollSnap: () => 0,
      on: vi.fn(),
      off: vi.fn(),
      scrollPrev: vi.fn(),
      scrollNext: vi.fn()
    }
  ]
}));

describe("PhotoGallery", () => {
  it("renders gallery images in display order with captions and alt text", () => {
    renderWithProviders(<PhotoGallery />);

    for (const photo of weddingContent.gallery) {
      expect(screen.getByAltText(photo.altText)).toBeInTheDocument();
      if (photo.caption) {
        expect(screen.getByText(photo.caption)).toBeInTheDocument();
      }
      expect(screen.getByAltText(photo.altText)).toHaveAttribute("src", photo.publicUrl);
    }

    expect(screen.getByRole("button", { name: "Ảnh trước" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ảnh tiếp theo" })).toBeInTheDocument();
  });
});
