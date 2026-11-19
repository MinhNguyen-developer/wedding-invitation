"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ScrollReveal } from "./scroll-scenes";
import { SectionEyebrow } from "./ui";
import { WeddingMonogram } from "./wedding-monogram";
import { isPlaceholderPhoto } from "@/lib/gallery-media-schema";
import { weddingContent } from "@/lib/wedding-content";

export function PhotoGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const hasRealPhotos = weddingContent.gallery.some((photo) => !isPlaceholderPhoto(photo.publicUrl));
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const updateSelected = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    updateSelected();
    emblaApi.on("select", updateSelected);
    emblaApi.on("reInit", updateSelected);
    return () => {
      emblaApi.off("select", updateSelected);
      emblaApi.off("reInit", updateSelected);
    };
  }, [emblaApi]);

  return (
    <section id="album" className="gallery-section" aria-labelledby="gallery-title">
      <div className="section-shell">
        <ScrollReveal className="gallery-heading">
          <div>
            <SectionEyebrow>Album tiền cưới</SectionEyebrow>
            <h2 id="gallery-title" className="section-title">Những khoảnh khắc<br /><em>thương yêu.</em></h2>
          </div>
          {hasRealPhotos ? (
            <div className="gallery-controls">
              <button type="button" aria-label="Xem ảnh trước" onClick={scrollPrev} className="gallery-control"><ChevronLeft aria-hidden="true" size={20} strokeWidth={1.25} /></button>
              <button type="button" aria-label="Xem ảnh tiếp theo" onClick={scrollNext} className="gallery-control"><ChevronRight aria-hidden="true" size={20} strokeWidth={1.25} /></button>
            </div>
          ) : null}
        </ScrollReveal>
        {hasRealPhotos ? (
          <>
            <div ref={emblaRef} className="overflow-hidden" role="region" aria-roledescription="carousel" aria-label="Album ảnh cưới của Minh và Hà">
              <div className="gallery-track">
                {weddingContent.gallery.map((photo, index) => {
                  const failed = failedImages[photo.publicUrl];
                  return (
                    <figure key={photo.storageObjectPath} className="gallery-slide" data-storage-object-path={photo.storageObjectPath} data-public-url={photo.publicUrl} role="group" aria-roledescription="slide" aria-label={`Ảnh ${index + 1} trên ${weddingContent.gallery.length}`}>
                      <div className="gallery-photo">
                        {isPlaceholderPhoto(photo.publicUrl) || failed ? (
                          <div className="gallery-photo-fallback">
                            <WeddingMonogram />
                            <div>
                              <p>{failed ? "Ảnh chưa tải được" : "Ảnh cưới sẽ sớm được cập nhật"}</p>
                              <p>{failed ? "Vui lòng tải lại trang để xem khoảnh khắc này." : "Hẹn bạn cùng lưu giữ những khoảnh khắc thương yêu."}</p>
                            </div>
                          </div>
                        ) : (
                          <Image fill sizes="(min-width: 1024px) 44vw, (min-width: 768px) 60vw, 87vw" src={photo.publicUrl} alt={photo.altText} className="object-cover" loading="lazy" onError={() => setFailedImages((current) => ({ ...current, [photo.publicUrl]: true }))} />
                        )}
                      </div>
                      <figcaption>{photo.caption}</figcaption>
                    </figure>
                  );
                })}
              </div>
            </div>
            <p className="gallery-position" role="status" aria-live="polite" aria-atomic="true">Ảnh {selectedIndex + 1} trên {weddingContent.gallery.length}: {weddingContent.gallery[selectedIndex]?.caption}</p>
          </>
        ) : (
          <ScrollReveal className="gallery-empty">
            <div>
              <h3>Những bức hình sẽ sớm có mặt.</h3>
              <p className="section-copy">Chúng mình đang chuẩn bị album tiền cưới để cùng bạn lưu giữ những khoảnh khắc đáng nhớ. Hẹn bạn quay lại xem nhé.</p>
            </div>
            <WeddingMonogram />
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
