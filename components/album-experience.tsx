"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { GalleryMediaItem } from "@/lib/gallery-media-schema";
import { albumCamera, albumDesktopViewHeight, getAlbumImageSize } from "@/lib/album-frame";

const GalleryScene = dynamic(
  () =>
    import("./gallery-scene")
      .then((module) => module.GalleryScene)
      .catch(() => () => null),
  { ssr: false },
);
const photoId = (index: number) =>
  `photo-${String(index + 1).padStart(2, "0")}`;

function AlbumChapter({
  photo,
  index,
  count,
}: {
  photo: GalleryMediaItem;
  index: number;
  count: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [failed, setFailed] = useState(false);
  const [imageAspect, setImageAspect] = useState(1.5);
  const frame = getAlbumImageSize(imageAspect);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [28, 0, -28]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [9, 0, -9]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [65, 0, -65]);
  const tone = index >= 7 ? "dark" : index >= 3 ? "warm" : "light";

  return (
    <article
      ref={ref}
      id={photoId(index)}
      className={`album-chapter album-chapter-${tone}`}
      aria-labelledby={`${photoId(index)}-title`}
    >
      {index === 0 ? (
        <header className="album-title">
          <p>Quốc Minh & Nhật Hà · Album cưới</p>
          <h1>Những ngày đẹp nhất.</h1>
          <span>Một hành trình qua những điều mình thương.</span>
        </header>
      ) : null}
      <div className="album-chapter-copy">
        <p className="album-chapter-number">
          Khoảnh khắc {String(index + 1).padStart(2, "0")}{" "}
          <span>/ {String(count).padStart(2, "0")}</span>
        </p>
        <h2 id={`${photoId(index)}-title`}>{photo.caption}</h2>
        <p className="album-chapter-signature">
          Minh & Hà <span>—</span> Một đời bên nhau.
        </p>
      </div>
      <div className="album-chapter-visual">
        <div className="album-chapter-background" aria-hidden="true" />
        <motion.figure
          className="album-photo"
          style={{ rotateY, rotateX, y,
            "--photo-unit": `${100 / albumDesktopViewHeight}svh`,
            "--photo-frame-width": frame.frameWidth,
            "--photo-frame-height": frame.frameHeight,
            "--photo-center-x": albumCamera.desktopX,
            "--photo-mat-x": (frame.frameWidth - frame.width) / 2,
            "--photo-mat-y": (frame.frameHeight - frame.height) / 2,
          } as MotionStyle}
          data-storage-object-path={photo.storageObjectPath}
          data-public-url={photo.publicUrl}
          aria-labelledby={`${photoId(index)}-title`}
        >
          {failed ? (
            <div className="album-photo-error">
              <p>Ảnh đang được cập nhật</p>
              <span>{photo.caption}</span>
            </div>
          ) : (
            <Image
              fill
              src={photo.publicUrl}
              alt={photo.altText}
              sizes="(max-aspect-ratio: 11/10) 85vw, 45vw"
              priority={index === 0}
              loading={index === 0 ? undefined : "lazy"}
              className="object-contain"
              onError={() => setFailed(true)}
              onLoad={(event) => setImageAspect(event.currentTarget.naturalWidth / event.currentTarget.naturalHeight)}
            />
          )}
        </motion.figure>
      </div>
      {index === 0 ? (
        <a href="#photo-02" className="album-scroll-hint">
          <span>Cuộn để đi qua những ngày thương</span>
          <ArrowDown aria-hidden="true" size={18} />
        </a>
      ) : null}
    </article>
  );
}

export function AlbumExperience({
  photos,
}: {
  photos: readonly GalleryMediaItem[];
}) {
  const ref = useRef<HTMLElement>(null);
  const entered = useInView(ref, { once: true });
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const progressRef = useRef(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    progressRef.current = progress;
    const index = Math.max(
      0,
      Math.min(photos.length - 1, Math.round(progress * (photos.length - 1))),
    );
    if (index !== activeRef.current) {
      activeRef.current = index;
      setActive(index);
    }
  });

  useEffect(() => {
    let viewportHeight = window.innerHeight;
    function preservePhotoOnResize() {
      if (window.innerHeight === viewportHeight) return;
      viewportHeight = window.innerHeight;
      const section = ref.current;
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= viewportHeight) return;
      const top = bounds.top + window.scrollY;
      window.scrollTo({
        top:
          top +
          progressRef.current *
            Math.max(0, section.offsetHeight - viewportHeight),
        behavior: "instant",
      });
    }
    window.addEventListener("resize", preservePhotoOnResize, { passive: true });
    return () => window.removeEventListener("resize", preservePhotoOnResize);
  }, []);

  return (
    <section
      ref={ref}
      className="album-experience"
      data-renderer={ready ? "webgl" : "fallback"}
      data-active-photo={active + 1}
      aria-label="Hành trình album ảnh cưới"
    >
      <div className="album-world" aria-hidden="true">
        {entered ? (
          <GalleryScene
            photos={photos}
            progress={scrollYProgress}
            onReady={setReady}
            interactionRef={ref}
          />
        ) : null}
      </div>
      <div className="album-chapters">
        {photos.map((photo, index) => (
          <AlbumChapter
            key={photo.storageObjectPath}
            photo={photo}
            index={index}
            count={photos.length}
          />
        ))}
      </div>
      {photos.some((photo) => photo.isDemo) ? (
        <p className="album-demo-note">Ảnh minh họa · Album demo</p>
      ) : null}
      {/* <div className="album-controls" aria-label="Chuyển ảnh trong album">
        <a
          href={`#${photoId(Math.max(0, active - 1))}`}
          aria-label="Ảnh trước"
          aria-disabled={active === 0}
        >
          <ArrowLeft aria-hidden="true" size={18} />
        </a>
        <p role="status" aria-live="polite" aria-atomic="true">Ảnh {String(active + 1).padStart(2, "0")} <span>/ {String(photos.length).padStart(2, "0")}</span></p>
        <a
          href={
            active === photos.length - 1 ? "/#rsvp" : `#${photoId(active + 1)}`
          }
          aria-label={
            active === photos.length - 1 ? "Đến phần RSVP" : "Ảnh tiếp theo"
          }
        >
          <ArrowRight aria-hidden="true" size={18} />
        </a>
        <motion.div
          className="album-progress"
          style={{ scaleX: scrollYProgress }}
        />
      </div> */}
      <noscript>
        <style>{`.album-controls, .album-scroll-hint { display: none; } .album-photo { transform: none !important; }`}</style>
      </noscript>
    </section>
  );
}
