import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thiệp cưới Quốc Minh & Nhật Hà",
  description: "Trân trọng mời bạn đến chung vui cùng Quốc Minh và Nhật Hà. Xem thông tin lễ cưới, địa điểm, album và xác nhận tham dự.",
  openGraph: {
    title: "Thiệp cưới Quốc Minh & Nhật Hà",
    description: "Trân trọng mời bạn đến chung vui cùng Quốc Minh và Nhật Hà.",
    locale: "vi_VN",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
