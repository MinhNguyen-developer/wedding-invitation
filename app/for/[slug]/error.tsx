"use client";

import Link from "next/link";
import { PrimaryButton } from "@/components/ui";

export default function GuestError({ reset }: { reset: () => void }) {
  return <main className="guest-message"><p className="section-eyebrow">Minh & Hà</p><h1 className="section-title">Chưa mở được lời mời.</h1><p className="section-copy">Kết nối đang gián đoạn. Bạn hãy thử lại sau một chút nhé.</p><PrimaryButton onClick={reset}>Thử lại</PrimaryButton><Link href="/" className="text-link">Mở thiệp cưới</Link></main>;
}
