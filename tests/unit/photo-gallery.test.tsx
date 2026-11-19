import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PhotoGallery } from "@/components/photo-gallery";
import { renderWithProviders } from "./test-utils";

describe("PhotoGallery preview", () => {
  it("opens a dedicated album instead of repeating the photos on the invitation", () => {
    renderWithProviders(<PhotoGallery />);
    expect(screen.getByRole("link", { name: "Khám phá album" })).toHaveAttribute("href", "/album");
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByText(/10 khung hình/)).toBeInTheDocument();
  });
  it("keeps the album link usable when its preview photo cannot load", () => {
    renderWithProviders(<PhotoGallery />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByRole("link", { name: "Khám phá album" })).toHaveAttribute("href", "/album");
    expect(screen.getByText("Một lời hẹn, một đời bên nhau.")).toBeInTheDocument();
  });
});
