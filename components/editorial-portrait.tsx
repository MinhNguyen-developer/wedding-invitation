"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { isPlaceholderPhoto, type GalleryMediaItem } from "@/lib/gallery-media-schema";
import { WeddingMonogram } from "./wedding-monogram";

export function EditorialPortrait({ photo }: { photo: GalleryMediaItem }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const pointerX = useSpring(0, { stiffness: 120, damping: 22 });
  const rotateX = useTransform(scrollYProgress, [0, 1], [8, -8]);
  const rotateY = useTransform(() => (scrollYProgress.get() - 0.5) * 14 + pointerX.get());
  const showArtwork = isPlaceholderPhoto(photo.publicUrl) || failedSource === photo.publicUrl;

  return (
    <div ref={frameRef} className="editorial-portrait"
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 9);
      }}
      onPointerLeave={() => pointerX.set(0)}>
      <motion.div className="portrait-print" style={{ rotateX, rotateY }}>
        <div className="portrait-mat">
          {showArtwork ? (
            <div className="portrait-artwork">
              <span className="portrait-artwork-label">Chuyện chúng mình</span>
              <WeddingMonogram />
              <p>Một lời hẹn, một đời bên nhau.</p>
              <span className="portrait-artwork-signature">Minh & Hà</span>
            </div>
          ) : (
            <motion.div className="portrait-image" style={{ y }}>
              <Image fill priority src={photo.publicUrl} alt={photo.altText} sizes="(min-width: 1024px) 42vw, (min-width: 768px) 48vw, 92vw" className="object-cover" onError={() => setFailedSource(photo.publicUrl)} />
            </motion.div>
          )}
        </div>
        {photo.isDemo ? <span className="portrait-demo-label">Ảnh minh họa</span> : null}
        <span className="portrait-print-signature" aria-hidden="true">M / H · Một đời bên nhau</span>
      </motion.div>
    </div>
  );
}
