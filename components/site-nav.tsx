import { Camera, Heart, MapPin, Send } from "lucide-react";

const links = [
  { href: "#loi-moi", label: "Lời mời", icon: Heart },
  { href: "#dia-diem", label: "Địa điểm", icon: MapPin },
  { href: "#album", label: "Album", icon: Camera },
  { href: "#rsvp", label: "RSVP", icon: Send }
];

export function SiteNav() {
  return (
    <nav
      aria-label="Điều hướng thiệp cưới"
      className="fixed inset-x-0 top-0 z-[100] border-b border-rosewood/10 bg-ivory/90 shadow-[0_8px_28px_rgb(55_35_33/0.04)] backdrop-blur-xl"
    >
      <div className="section-shell flex min-h-16 items-center gap-2">
        <a
          className="shrink-0 font-display text-lg text-rosewood sm:text-xl"
          href="#loi-moi"
          aria-label="Minh và Hà, về đầu trang"
        >
          <span className="sm:hidden">M · H</span>
          <span className="hidden sm:inline">Minh & Hà</span>
        </a>
        <div className="ml-auto flex min-w-0 items-center justify-end gap-0.5 rounded-full border border-rosewood/10 bg-paper/80 p-1 sm:gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-full px-2 text-xs font-semibold text-ink transition-colors hover:bg-petal/60 active:bg-petal sm:gap-2 sm:px-3 sm:text-sm"
              href={href}
            >
              <Icon aria-hidden="true" className="hidden size-4 sm:block" />
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
