"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useInView, useMotionValue, useScroll } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollReveal } from "./scroll-scenes";
import { SectionEyebrow } from "./ui";
import { WeddingMonogram } from "./wedding-monogram";
import { isPlaceholderPhoto } from "@/lib/gallery-media-schema";
import { weddingContent } from "@/lib/wedding-content";

const GalleryScene = dynamic(() => import("./gallery-scene").then((module) => module.GalleryScene).catch(() => () => null), { ssr: false });

export function PhotoGallery() {
  const stageRef = useRef<HTMLElement>(null);
  const hasEntered = useInView(stageRef, { once: true, margin: "200px" });
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end start"] });
  const selection = useMotionValue(0);
  const [webglReady, setWebglReady] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const hasRealPhotos = weddingContent.gallery.some((photo) => !isPlaceholderPhoto(photo.publicUrl));
  const hasDemoPhotos = weddingContent.gallery.some((photo) => photo.isDemo);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const updateSelected = () => {
      const index = emblaApi.selectedScrollSnap();
      setSelectedIndex(index);
      selection.set(index);
    };
    updateSelected();
    emblaApi.on("select", updateSelected);
    emblaApi.on("reInit", updateSelected);
    return () => {
      emblaApi.off("select", updateSelected);
      emblaApi.off("reInit", updateSelected);
    };
  }, [emblaApi, selection]);

  return (
    <section ref={stageRef} id="album" className="gallery-section" aria-labelledby="gallery-title">
      <div className="section-shell">
        <ScrollReveal className="gallery-heading">
          <div>
            <SectionEyebrow>Album tiền cưới</SectionEyebrow>
            <h2 id="gallery-title" className="section-title">Những khoảnh khắc<br /><em>thương yêu.</em></h2>
            {hasDemoPhotos ? <p className="gallery-demo-label">Ảnh minh họa · Album demo</p> : null}
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
            <div className="gallery-renderer" data-renderer={webglReady ? "webgl" : "fallback"}>
              {hasEntered ? <GalleryScene photos={weddingContent.gallery} progress={scrollYProgress} selection={selection} onReady={setWebglReady} /> : null}
              <div className="gallery-stage-label" aria-hidden="true"><span>M / H</span><span>Những điều mình lưu giữ</span></div>
              <div ref={emblaRef} className="gallery-viewport" role="region" aria-roledescription="carousel" aria-label={hasDemoPhotos ? "Album ảnh cưới minh họa" : "Album ảnh cưới của Minh và Hà"}>
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
            </div>
            <noscript><style>{`.gallery-renderer { height: auto !important; background: none; } .gallery-viewport { overflow: visible; } .gallery-track { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); } .gallery-renderer .gallery-slide { height: auto; display: block; } .gallery-renderer .gallery-photo { width: 100%; height: auto; max-height: none; } .gallery-controls, .gallery-position, .gallery-stage-label { display: none; }`}</style></noscript>
            <p className="gallery-interaction-hint">Vuốt hoặc dùng mũi tên để xem từng khoảnh khắc.</p>
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
