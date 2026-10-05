"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Flower2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { SectionEyebrow } from "./ui";
import { weddingContent } from "@/lib/wedding-content";

const isTemporaryPhoto = (publicUrl: string) =>
  publicUrl.startsWith("/images/pre-wedding/") && publicUrl.endsWith(".svg");

export function PhotoGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const hasRealPhotos = weddingContent.gallery.some((photo) => !isTemporaryPhoto(photo.publicUrl));

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const markImageFailed = useCallback((publicUrl: string) => {
    setFailedImages((current) => ({ ...current, [publicUrl]: true }));
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const updateSelected = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    updateSelected();
    emblaApi.on("select", updateSelected);

    return () => {
      emblaApi.off("select", updateSelected);
    };
  }, [emblaApi]);

  return (
    <section id="album" className="overflow-hidden py-20 md:py-24" aria-labelledby="gallery-title">
      <div className="section-shell">
        <div className="mb-9 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <SectionEyebrow>Album tiền cưới</SectionEyebrow>
            <h2 id="gallery-title" className="mt-5 font-display text-4xl leading-tight tracking-[-0.025em] text-ink sm:text-5xl">
              Những khoảnh khắc thương yêu
            </h2>
          </div>
          {hasRealPhotos ? (
            <div className="flex gap-2 self-start sm:self-auto">
              <button
                type="button"
                aria-label="Xem ảnh trước"
                onClick={scrollPrev}
                className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-rosewood/20 bg-paper text-rosewood transition-colors hover:bg-petal/55 active:bg-petal"
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Xem ảnh tiếp theo"
                onClick={scrollNext}
                className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-rosewood/20 bg-paper text-rosewood transition-colors hover:bg-petal/55 active:bg-petal"
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            </div>
          ) : null}
        </div>

        {hasRealPhotos ? (
          <>
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              Ảnh {selectedIndex + 1} trên {weddingContent.gallery.length}: {weddingContent.gallery[selectedIndex]?.caption}
            </p>
            <div
              ref={emblaRef}
              className="overflow-hidden"
              role="region"
              aria-roledescription="carousel"
              aria-label="Album ảnh cưới của Minh và Hà"
            >
              <div className="flex touch-pan-y gap-4 pb-2">
                {weddingContent.gallery.map((photo, index) => {
                  const showPlaceholder = isTemporaryPhoto(photo.publicUrl) || failedImages[photo.publicUrl];

                  return (
                    <figure
                      key={photo.storageObjectPath}
                      className="min-w-0 flex-[0_0_88%] transition-opacity duration-300 data-[selected=false]:opacity-70 sm:flex-[0_0_58%] lg:flex-[0_0_43%]"
                      data-selected={selectedIndex === index}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`Ảnh ${index + 1} trên ${weddingContent.gallery.length}`}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-rosewood/10 bg-sand shadow-card sm:rounded-[2rem]">
                        {showPlaceholder ? (
                          <div
                            className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_38%,#fffdf9_0%,#f8eee5_58%,#eadbd0_100%)] px-7 text-center"
                            role="img"
                            aria-label={failedImages[photo.publicUrl] ? photo.altText : "Ảnh cưới sẽ sớm được cập nhật"}
                          >
                            <div aria-hidden="true" className="absolute inset-5 rounded-[1.4rem] border border-gold/25" />
                            <Flower2 aria-hidden="true" className="relative size-16 stroke-[0.8] text-rosewood/70" />
                            <p className="relative mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                              {failedImages[photo.publicUrl] ? "Ảnh chưa tải được" : "Album của Minh & Hà"}
                            </p>
                            <p className="relative mt-2 font-display text-3xl text-rosewood">{photo.caption}</p>
                            <p className="relative mt-2 max-w-[18rem] text-sm leading-6 text-ink/70">
                              {failedImages[photo.publicUrl]
                                ? "Vui lòng tải lại trang để xem khoảnh khắc này."
                                : "Ảnh cưới thật sẽ được cập nhật tại đây."}
                            </p>
                          </div>
                        ) : (
                          <Image
                            fill
                            sizes="(min-width: 1024px) 43vw, (min-width: 640px) 58vw, 88vw"
                            src={photo.publicUrl}
                            alt={photo.altText}
                            className="object-cover"
                            loading="lazy"
                            onError={() => markImageFailed(photo.publicUrl)}
                          />
                        )}
                      </div>
                      <figcaption className="mt-4 text-center font-display text-2xl text-rosewood">
                        {photo.caption}
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="relative overflow-hidden rounded-[2rem] border border-rosewood/10 bg-paper/85 p-7 shadow-soft sm:p-11">
            <div aria-hidden="true" className="absolute -right-20 -top-24 size-72 rounded-full border border-gold/15" />
            <div className="absolute -bottom-28 right-[12%] size-64 rounded-full bg-petal/30 blur-3xl" aria-hidden="true" />
            <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-14">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Album đang được chuẩn bị</p>
                <h3 className="mt-4 font-display text-3xl leading-tight text-rosewood sm:text-4xl">
                  Những bức hình sẽ sớm có mặt.
                </h3>
                <p className="mt-3 text-base leading-7 text-ink/70">
                  Chúng mình sẽ chia sẻ album tiền cưới tại đây để bạn cùng lưu giữ những khoảnh khắc đáng nhớ.
                </p>
              </div>
              <div className="mx-auto flex size-40 items-center justify-center rounded-full border border-gold/20 bg-sand/75 text-rosewood md:size-48">
                <Flower2 aria-hidden="true" className="size-24 stroke-[0.75] text-rosewood/65 md:size-28" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
