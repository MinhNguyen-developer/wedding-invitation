import Link from "next/link";

export default function GuestNotFound() {
  return <main className="guest-message"><p className="section-eyebrow">Minh & Hà</p><h1 className="section-title">Chưa tìm thấy lời mời này.</h1><p className="section-copy">Bạn hãy kiểm tra lại link được gửi, hoặc mở thiệp cưới bên dưới nhé.</p><Link href="/" className="text-link">Mở thiệp cưới của Minh & Hà</Link></main>;
}
