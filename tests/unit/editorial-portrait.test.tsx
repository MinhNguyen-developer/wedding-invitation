import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EditorialPortrait } from "@/components/editorial-portrait";
import { weddingContent } from "@/lib/wedding-content";
import { renderWithProviders } from "./test-utils";

describe("EditorialPortrait", () => {
  const photo = { ...weddingContent.gallery[0], publicUrl: "https://example.com/photo.jpg" };

  it("uses intentional artwork while the couple's real photos are unavailable", () => {
    renderWithProviders(<EditorialPortrait photo={{ ...photo, publicUrl: "/images/pre-wedding/pre-wedding-01.svg" }} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Một lời hẹn, một đời bên nhau.")).toBeInTheDocument();
  });

  it("shows the configured photo and falls back gracefully when it cannot load", () => {
    renderWithProviders(<EditorialPortrait photo={photo} />);
    const image = screen.getByAltText(photo.altText);
    expect(image).toHaveAttribute("src", photo.publicUrl);
    fireEvent.error(image);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Một lời hẹn, một đời bên nhau.")).toBeInTheDocument();
  });
});
