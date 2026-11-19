const links = [
  { href: "#loi-moi", label: "Lời mời" },
  { href: "#album", label: "Album" },
  { href: "#dia-diem", label: "Địa điểm" },
  { href: "#rsvp", label: "RSVP" }
];

export function SiteNav() {
  return (
    <nav aria-label="Điều hướng thiệp cưới" className="site-nav">
      <div className="section-shell nav-inner">
        <a className="site-wordmark" href="#loi-moi" aria-label="Minh và Hà, về đầu trang">M<span>&</span>H</a>
        <div className="site-links">
          {links.map(({ href, label }) => <a key={href} href={href} className={href === "#rsvp" ? "nav-rsvp" : undefined}>{label}</a>)}
        </div>
      </div>
    </nav>
  );
}
