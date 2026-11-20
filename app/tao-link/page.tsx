import type { Metadata } from "next";
import Link from "next/link";
import { GuestLinkGenerator } from "@/components/guest-link-generator";

export const metadata: Metadata = { title: "Tạo lời mời riêng · Minh & Hà", robots: { index: false, follow: false } };

export default function GuestLinkPage() {
  return (
    <main className="guest-builder-shell">
      <header className="guest-builder-header"><Link href="/" className="site-wordmark" aria-label="Về thiệp cưới">M<span>&</span>H</Link><span>Dành cho chủ thiệp</span></header>
      <div className="guest-builder-intro"><p className="section-eyebrow">Lời mời của chúng mình</p><h1 className="section-title">Dành một lời mời riêng.</h1><p className="section-copy">Gọi đúng tên người bạn thương, rồi gửi đi một ngày vui.</p></div>
      <GuestLinkGenerator />
      <Link href="/" className="text-link guest-builder-back">Trở về thiệp cưới</Link>
    </main>
  );
}
