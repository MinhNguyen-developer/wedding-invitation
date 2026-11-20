import { InvitationSection } from "./invitation-section";
import { PhotoGallery } from "./photo-gallery";
import { RsvpForm } from "./rsvp-form";
import { SiteNav } from "./site-nav";
import { VenueSection } from "./venue-section";
import { guestAlbumPath } from "@/lib/guest-link";
import { weddingContent } from "@/lib/wedding-content";

export function WeddingInvitation({ guestName, guestSlug }: { guestName?: string; guestSlug?: string }) {
  const albumHref = guestAlbumPath(guestSlug);
  return (
    <>
      <a className="skip-link" href="#main-content">Bỏ qua điều hướng, đến nội dung chính</a>
      <SiteNav albumHref={albumHref} />
      <main id="main-content" tabIndex={-1}>
        <InvitationSection guestName={guestName} albumHref={albumHref} />
        <PhotoGallery albumHref={albumHref} />
        <VenueSection />
        <RsvpForm key={guestSlug} initialGuestName={guestName} />
      </main>
      <footer className="site-footer">
        <p className="footer-thanks">Có bạn, ngày vui thêm trọn vẹn.</p>
        <a className="footer-names" href="#loi-moi">{weddingContent.coupleNames}</a>
        <p>{weddingContent.weddingDate}</p>
      </footer>
    </>
  );
}
