import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InvitationSection } from "@/components/invitation-section";
import { VenueSection } from "@/components/venue-section";
import { weddingContent } from "@/lib/wedding-content";
import { renderWithProviders } from "./test-utils";

describe("InvitationSection", () => {
  it("shows the exact personal greeting on the opening stage", () => {
    renderWithProviders(<InvitationSection guestName="bạn Hoàng Anh" />);
    const opening = screen.getByRole("region", { name: "Mở thiệp cưới" });
    expect(within(opening).getByText("Thân mời bạn Hoàng Anh")).toBeInTheDocument();
  });

  it("renders Vietnamese invitation content and required event details", () => {
    renderWithProviders(
      <>
        <InvitationSection />
        <VenueSection />
      </>
    );

    expect(screen.getByRole("heading", { name: weddingContent.coupleNames })).toBeInTheDocument();
    expect(screen.getByText(weddingContent.invitationMessage, { normalizer: (text) => text })).toBeInTheDocument();
    expect(screen.getAllByText(weddingContent.weddingDate).length).toBeGreaterThan(0);
    expect(screen.getAllByText(weddingContent.weddingTime).length).toBeGreaterThan(0);
    expect(screen.getByText(weddingContent.venueName)).toBeInTheDocument();
    expect(screen.getByText(weddingContent.venueAddress)).toBeInTheDocument();
  });

  it("offers a curtain opening and a separate editorial invitation with a direct RSVP route", () => {
    renderWithProviders(<InvitationSection />);
    const opening = screen.getByRole("region", { name: "Mở thiệp cưới" });
    const editorial = screen.getByRole("region", { name: "Thiệp cưới của Quốc Minh và Nhật Hà" });

    expect(within(opening).getByRole("heading", { level: 1, name: weddingContent.coupleNames })).toBeInTheDocument();
    expect(within(opening).getByRole("link", { name: "Xác nhận tham dự" })).toHaveAttribute("href", "#rsvp");
    expect(within(opening).getByRole("link", { name: "Khám phá lời mời" })).toHaveAttribute("href", "#thiep-cuoi");
    expect(within(editorial).getByText(weddingContent.invitationMessage, { normalizer: (text) => text })).toBeInTheDocument();
  });
});
