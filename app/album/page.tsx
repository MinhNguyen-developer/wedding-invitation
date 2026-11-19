import type { Metadata } from "next";
import Link from "next/link";
import { AlbumExperience } from "@/components/album-experience";
import { SiteNav } from "@/components/site-nav";
import { weddingContent } from "@/lib/wedding-content";

export const metadata: Metadata = {
  title: "Album ảnh cưới · Quốc Minh & Nhật Hà",
  description: "Một hành trình qua những khoảnh khắc yêu thương của Quốc Minh và Nhật Hà."
};

export default function AlbumPage() {
  return (
    <>
      <a href="#album-content" className="skip-link">Bỏ qua điều hướng, đến album ảnh</a>
      <SiteNav onAlbum />
      <main id="album-content" tabIndex={-1} className="album-page">
        <AlbumExperience photos={weddingContent.gallery} />
      </main>
      <footer className="site-footer album-footer">
        <p className="footer-thanks">Khoảnh khắc ở lại. Yêu thương tiếp nối.</p>
        <Link href="/#rsvp" className="text-link">Hẹn gặp bạn trong ngày chung đôi</Link>
        <p><Link href="/">Trở về thiệp cưới của Minh & Hà</Link></p>
      </footer>
    </>
  );
}
