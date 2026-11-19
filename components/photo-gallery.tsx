import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EditorialPortrait } from "./editorial-portrait";
import { SectionEyebrow } from "./ui";
import { weddingContent } from "@/lib/wedding-content";

export function PhotoGallery() {
  return (
    <section id="album" className="gallery-section" aria-labelledby="gallery-title">
      <div className="section-shell album-preview">
        <div>
          <SectionEyebrow>Album tiền cưới</SectionEyebrow>
          <h2 id="gallery-title" className="section-title">Chúng mình,<br /><em>trong từng khoảnh khắc.</em></h2>
          <p className="section-copy">{weddingContent.gallery.length} khung hình. Một câu chuyện yêu thương.<br />Cùng mở những ngày đẹp nhất của chúng mình.</p>
          <Link href="/album" prefetch={false} className="text-link album-preview-link">Khám phá album <ArrowUpRight aria-hidden="true" size={18} /></Link>
        </div>
        <div className="album-preview-portrait"><EditorialPortrait photo={weddingContent.gallery[0]} /></div>
      </div>
    </section>
  );
}
