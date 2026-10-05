import { ArrowUpRight, MapPin } from "lucide-react";
import { SectionEyebrow } from "./ui";
import { weddingContent } from "@/lib/wedding-content";

export function VenueSection() {
  return (
    <section id="dia-diem" className="relative overflow-hidden bg-paper/65 py-20 md:py-24" aria-labelledby="venue-title">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 top-8 size-72 rounded-full border border-sage/10" />
      <div className="section-shell relative grid gap-9 md:grid-cols-[0.82fr_1.18fr] md:items-center md:gap-16">
        <div className="max-w-md">
          <SectionEyebrow>Ngày vui của chúng mình</SectionEyebrow>
          <h2 id="venue-title" className="mt-5 font-display text-4xl leading-tight tracking-[-0.025em] text-ink sm:text-5xl">
            Chúng mình hẹn nhau ở đây nhé.
          </h2>
          <p className="mt-5 text-base leading-7 text-ink/75">
            Một buổi gặp gỡ ấm áp sẽ vui hơn khi có bạn cùng chung vui. Lưu lại địa chỉ để tiện đường đến với chúng mình.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-rosewood/10 bg-white/85 p-6 shadow-card sm:p-9">
          <div aria-hidden="true" className="absolute -right-16 -top-20 size-64 rounded-full bg-petal/30 blur-3xl" />
          <div className="relative flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-rosewood text-white shadow-soft">
                <MapPin aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Địa điểm tổ chức</p>
                <h3 className="mt-2 font-display text-3xl leading-tight text-rosewood sm:text-4xl">
                  {weddingContent.venueName}
                </h3>
                <p className="mt-3 max-w-md text-base leading-7 text-ink/75">
                  {weddingContent.venueAddress}
                </p>
              </div>
            </div>

            <a
              className="inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-rosewood/20 bg-paper px-5 text-sm font-semibold text-rosewood transition-colors hover:bg-petal/45 active:bg-petal/70"
              href={weddingContent.venueMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Mở bản đồ đến ${weddingContent.venueName} trong thẻ mới`}
            >
              Mở bản đồ
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </div>

          <div className="relative mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-rosewood/10 pt-5 text-sm text-ink/75">
            <span className="font-semibold text-rosewood">{weddingContent.weddingDate}</span>
            <span className="hidden size-1 rounded-full bg-gold/70 sm:block" aria-hidden="true" />
            <span>{weddingContent.weddingTime}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
