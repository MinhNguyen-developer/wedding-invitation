import { InvitationSection } from "@/components/invitation-section";
import { PhotoGallery } from "@/components/photo-gallery";
import { RsvpForm } from "@/components/rsvp-form";
import { SiteNav } from "@/components/site-nav";
import { VenueSection } from "@/components/venue-section";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <InvitationSection />
        <VenueSection />
        <RsvpForm />
        <PhotoGallery />
      </main>
      <footer className="border-t border-rosewood/10 py-8 text-center text-sm text-ink/65">
        <p>Cảm ơn bạn đã là một phần trong ngày hạnh phúc của Minh & Hà.</p>
      </footer>
    </>
  );
}
