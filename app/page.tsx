import { InvitationSection } from "@/components/invitation-section";
import { PhotoGallery } from "@/components/photo-gallery";
import { RsvpForm } from "@/components/rsvp-form";
import { SiteNav } from "@/components/site-nav";
import { VenueSection } from "@/components/venue-section";
import { weddingContent } from "@/lib/wedding-content";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng, đến nội dung chính
      </a>
      <SiteNav />
      <main id="main-content" tabIndex={-1}>
        <InvitationSection />
        <PhotoGallery />
        <VenueSection />
        <RsvpForm />
      </main>
      <footer className="site-footer">
        <p className="footer-thanks">Có bạn, ngày vui thêm trọn vẹn.</p>
        <a className="footer-names" href="#loi-moi">{weddingContent.coupleNames}</a>
        <p>{weddingContent.weddingDate}</p>
      </footer>
    </>
  );
}
