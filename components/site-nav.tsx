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
      className="fixed inset-x-0 top-0 z-[100] border-b border-white/45 bg-ivory/85 backdrop-blur-md"
    >
      <div className="section-shell flex min-h-16 items-center justify-between gap-4">
        <a className="font-display text-xl text-rosewood" href="#loi-moi">
          Minh & Hà
        </a>
        <div className="flex items-center gap-1 overflow-x-auto rounded-md bg-white/55 p-1">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              className="inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-ink transition hover:bg-petal/70"
              href={href}
              title={label}
            >
              <Icon aria-hidden="true" className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
