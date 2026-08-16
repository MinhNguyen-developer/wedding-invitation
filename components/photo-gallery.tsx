"use client";

import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { SectionEyebrow } from "./ui";
import { weddingContent } from "@/lib/wedding-content";

export function PhotoGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "center", loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

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
    <section id="album" className="bg-[#f7f1ea] py-20" aria-labelledby="gallery-title">
      <div className="section-shell">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <SectionEyebrow>Album tiền cưới</SectionEyebrow>
            <h2 id="gallery-title" className="mt-4 font-display text-4xl text-ink sm:text-5xl">
              Những khoảnh khắc thương yêu
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Ảnh trước"
              title="Ảnh trước"
              onClick={scrollPrev}
              className="inline-flex size-11 items-center justify-center rounded-md border border-rosewood/25 bg-white text-rosewood transition hover:bg-petal/60"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Ảnh tiếp theo"
              title="Ảnh tiếp theo"
              onClick={scrollNext}
              className="inline-flex size-11 items-center justify-center rounded-md border border-rosewood/25 bg-white text-rosewood transition hover:bg-petal/60"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y gap-4">
            {weddingContent.gallery.map((photo, index) => (
              <motion.figure
                key={photo.storageObjectPath}
                className="min-w-0 flex-[0_0_86%] sm:flex-[0_0_58%] lg:flex-[0_0_42%]"
                animate={{ opacity: selectedIndex === index ? 1 : 0.72, scale: selectedIndex === index ? 1 : 0.96 }}
                transition={{ duration: 0.35 }}
                data-public-url={photo.publicUrl}
                data-storage-object-path={photo.storageObjectPath}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-white shadow-soft">
                  {failedImages[photo.publicUrl] ? (
                    <div className="flex h-full items-center justify-center bg-petal/60 p-6 text-center text-sm leading-6 text-ink/70">
                      {photo.altText}
                    </div>
                  ) : (
                    <Image
                      fill
                      sizes="(min-width: 1024px) 42vw, (min-width: 640px) 58vw, 86vw"
                      src={photo.publicUrl}
                      alt={photo.altText}
                      className="pointer-events-none object-cover"
                      priority={index === 0}
                      onError={() => markImageFailed(photo.publicUrl)}
                    />
                  )}
                </div>
                <figcaption className="mt-4 text-center font-display text-2xl text-rosewood">{photo.caption}</figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
