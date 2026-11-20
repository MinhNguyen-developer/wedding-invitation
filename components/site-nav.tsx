import Link from "next/link";

export function SiteNav({ onAlbum = false, invitationPath = "/", albumHref = "/album" }: { onAlbum?: boolean; invitationPath?: string; albumHref?: string }) {
  const home = onAlbum ? invitationPath : "";
  const links = [
    { href: `${home}#loi-moi`, label: "Lời mời" },
    { href: albumHref, label: "Album" },
    { href: `${home}#dia-diem`, label: "Địa điểm" },
    { href: `${home}#rsvp`, label: "RSVP" }
  ];
  return (
    <nav aria-label="Điều hướng thiệp cưới" className="site-nav">
      <div className="section-shell nav-inner">
        <a className="site-wordmark" href={`${home}#loi-moi`} aria-label="Minh và Hà, về đầu trang">M<span>&</span>H</a>
        <div className="site-links">
          {links.map(({ href, label }) => <Link key={href} href={href} prefetch={false} aria-current={onAlbum && label === "Album" ? "page" : undefined} className={label === "RSVP" ? "nav-rsvp" : undefined}>{label}</Link>)}
        </div>
      </div>
    </nav>
  );
}
