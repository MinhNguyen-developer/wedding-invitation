import { InvitationSection } from "@/components/invitation-section";
import { PhotoGallery } from "@/components/photo-gallery";
import { RsvpForm } from "@/components/rsvp-form";
import { SiteNav } from "@/components/site-nav";
import { VenueSection } from "@/components/venue-section";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Bỏ qua điều hướng, đến nội dung chính
      </a>
      <SiteNav />
      <main id="main-content" tabIndex={-1}>
        <InvitationSection />
        <VenueSection />
        <RsvpForm />
        <PhotoGallery />
      </main>
      <footer className="border-t border-rosewood/10 bg-paper/70 px-4 py-9 text-center text-sm leading-6 text-ink/70">
        <p className="font-display text-lg text-rosewood">
          Cảm ơn bạn đã là một phần trong ngày hạnh phúc của Quốc Minh & Nhật Hà.
        </p>
      </footer>
    </>
  );
}
