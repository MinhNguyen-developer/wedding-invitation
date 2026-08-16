import { ExternalLink, MapPin } from "lucide-react";
import { SectionEyebrow } from "./ui";
import { weddingContent } from "@/lib/wedding-content";

export function VenueSection() {
  return (
    <section id="dia-diem" className="py-20" aria-labelledby="venue-title">
      <div className="section-shell grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
        <div>
          <SectionEyebrow>Thông tin buổi tiệc</SectionEyebrow>
          <h2 id="venue-title" className="mt-4 font-display text-4xl text-ink sm:text-5xl">
            Thời gian & địa điểm
          </h2>
        </div>
        <div className="grid gap-4 rounded-md border border-rosewood/10 bg-white/72 p-6 shadow-soft">
          <div className="flex gap-4">
            <MapPin aria-hidden="true" className="mt-1 size-6 shrink-0 text-rosewood" />
            <div>
              <p className="text-xl font-semibold text-ink">{weddingContent.venueName}</p>
              <p className="mt-2 leading-7 text-ink/70">{weddingContent.venueAddress}</p>
            </div>
          </div>
          <a
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-md border border-rosewood/25 px-4 py-2 text-sm font-semibold text-rosewood transition hover:bg-petal/60"
            href={weddingContent.venueMapUrl}
            target="_blank"
            rel="noreferrer"
          >
            Xem bản đồ
            <ExternalLink aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
