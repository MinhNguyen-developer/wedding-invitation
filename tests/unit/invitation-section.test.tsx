import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InvitationSection } from "@/components/invitation-section";
import { VenueSection } from "@/components/venue-section";
import { weddingContent } from "@/lib/wedding-content";
import { renderWithProviders } from "./test-utils";

describe("InvitationSection", () => {
  it("renders Vietnamese invitation content and required event details", () => {
    renderWithProviders(
      <>
        <InvitationSection />
        <VenueSection />
      </>
    );

    expect(screen.getByRole("heading", { name: weddingContent.coupleNames })).toBeInTheDocument();
    expect(screen.getByText(weddingContent.invitationMessage)).toBeInTheDocument();
    expect(screen.getByText(weddingContent.weddingDate)).toBeInTheDocument();
    expect(screen.getByText(weddingContent.weddingTime)).toBeInTheDocument();
    expect(screen.getByText(weddingContent.venueName)).toBeInTheDocument();
    expect(screen.getByText(weddingContent.venueAddress)).toBeInTheDocument();
  });
});
