import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thiệp cưới Minh & Hà",
  description: "Thiệp mời đám cưới bằng tiếng Việt với thông tin lễ cưới, ảnh cưới và xác nhận tham dự.",
  metadataBase: new URL("https://example.com")
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
