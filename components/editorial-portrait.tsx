"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { isPlaceholderPhoto, type GalleryMediaItem } from "@/lib/gallery-media-schema";
import { WeddingMonogram } from "./wedding-monogram";

export function EditorialPortrait({ photo }: { photo: GalleryMediaItem }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);
  const showArtwork = isPlaceholderPhoto(photo.publicUrl) || failedSource === photo.publicUrl;

  return (
    <div ref={frameRef} className="editorial-portrait">
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
  );
}
