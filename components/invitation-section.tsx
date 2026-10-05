import { CalendarDays, Clock, Flower2, Heart, Send } from "lucide-react";
import Image from "next/image";
import { SectionEyebrow } from "./ui";
import { weddingContent } from "@/lib/wedding-content";

export function InvitationSection() {
  const heroPhoto = weddingContent.gallery[0];
  const hasHeroPhoto = !(
    heroPhoto.publicUrl.startsWith("/images/pre-wedding/") && heroPhoto.publicUrl.endsWith(".svg")
  );

  return (
    <section
      id="loi-moi"
      className="relative isolate overflow-hidden bg-ivory pt-16"
      aria-labelledby="invitation-title"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-36 -top-24 size-[28rem] rounded-full border border-gold/10 sm:size-[38rem]" />
        <div className="absolute -right-20 -top-8 size-[21rem] rounded-full border border-rosewood/10 sm:size-[30rem]" />
        <div className="absolute -bottom-44 -left-32 size-[30rem] rounded-full bg-petal/25 blur-3xl" />
        <Flower2 className="absolute right-[8%] top-[17%] hidden size-52 stroke-[0.65] text-gold/15 lg:block" />
      </div>

      <div className="section-shell relative grid min-h-[calc(100svh-4rem)] items-center gap-12 py-12 md:grid-cols-[1.06fr_0.94fr] md:gap-10 md:py-16 lg:gap-16">
        <div className="max-w-2xl py-4">
          <SectionEyebrow>Trân trọng mời bạn</SectionEyebrow>
          <h1
            id="invitation-title"
            className="mt-6 max-w-xl font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.94] tracking-[-0.045em] text-rosewood"
          >
            {weddingContent.coupleNames}
          </h1>
          <p className="mt-4 font-display text-2xl italic leading-tight text-ink/80 sm:text-3xl">
            Đã quyết định về chung một nhà
          </p>
          <p className="mt-6 max-w-xl whitespace-pre-line text-base leading-7 text-ink/80 sm:text-lg sm:leading-8">
            {weddingContent.invitationMessage}
          </p>

          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-[1.35fr_0.65fr]">
            <div className="flex items-start gap-3 rounded-2xl border border-rosewood/10 bg-paper/80 px-4 py-4 shadow-soft">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-petal/55 text-rosewood">
                <CalendarDays aria-hidden="true" className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-gold">Ngày vui</span>
                <span className="mt-1 block text-sm font-semibold leading-5 text-ink sm:text-base">
                  {weddingContent.weddingDate}
                </span>
              </span>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-rosewood/10 bg-paper/80 px-4 py-4 shadow-soft">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage/15 text-sage">
                <Clock aria-hidden="true" className="size-5" />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-gold">Bắt đầu</span>
                <span className="mt-1 block text-base font-semibold text-ink">{weddingContent.weddingTime}</span>
              </span>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#rsvp"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-rosewood px-6 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-rosewood/90 active:bg-rosewood/80"
            >
              <Send aria-hidden="true" className="size-4" />
              Xác nhận tham dự
            </a>
            <a
              href="#dia-diem"
              className="inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-semibold text-rosewood transition-colors hover:bg-white/70"
            >
              Xem địa điểm
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[430px] md:ml-auto">
          <div aria-hidden="true" className="absolute -right-4 top-10 h-3/4 w-8 rounded-full bg-sage/20 blur-xl sm:-right-7 sm:w-14" />
          <div className="relative rounded-t-[13rem] rounded-b-[2rem] border-[8px] border-white bg-white shadow-card sm:rounded-t-[15rem] sm:border-[10px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[12rem] rounded-b-[1.4rem] bg-sand sm:rounded-t-[14rem]">
              {hasHeroPhoto ? (
                <Image
                  fill
                  priority
                  src={heroPhoto.publicUrl}
                  alt={heroPhoto.altText}
                  sizes="(min-width: 768px) 42vw, 88vw"
                  className="object-cover"
                />
              ) : (
                <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_38%,#fffdf9_0%,#f8eee5_55%,#eadbd0_100%)] px-8 text-center">
                  <div aria-hidden="true" className="absolute inset-5 rounded-t-[11rem] rounded-b-[1rem] border border-gold/25 sm:inset-7" />
                  <div aria-hidden="true" className="absolute -left-16 top-10 size-36 rounded-full bg-petal/40 blur-2xl" />
                  <Flower2 aria-hidden="true" className="relative size-20 stroke-[0.8] text-rosewood/70 sm:size-24" />
                  <p className="relative mt-7 font-display text-3xl leading-tight text-rosewood sm:text-4xl">
                    Quốc Minh
                    <span className="block py-1 text-xl italic text-gold">và</span>
                    Nhật Hà
                  </p>
                  <span className="relative mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                    23 · 01 · 2027
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-sm text-center">
            <Heart aria-hidden="true" className="mx-auto mb-3 size-5 fill-petal text-rosewood" />
            <p className="font-display text-2xl leading-tight text-ink sm:text-[1.7rem]">
              Hẹn gặp bạn trong ngày vui của chúng mình.
            </p>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              Sự hiện diện của bạn là món quà ý nghĩa nhất dành cho {weddingContent.brideName} và {weddingContent.groomName}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
