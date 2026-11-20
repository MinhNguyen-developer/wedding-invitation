import { ScrollReveal } from "./scroll-scenes";
import { SectionEyebrow } from "./ui";
import { weddingContent } from "@/lib/wedding-content";

export function VenueSection() {
  return (
    <section id="dia-diem" className="venue-section" aria-labelledby="venue-title">
      <ScrollReveal className="section-shell venue-layout">
        <div className="venue-intro">
          <SectionEyebrow>Ngày chung đôi</SectionEyebrow>
          <h2 id="venue-title" className="section-title">Chúng mình<br /><em>hẹn nhau ở đây.</em></h2>
          <p className="section-copy">Một buổi gặp gỡ ấm áp sẽ vui hơn khi có bạn cùng chung vui. Lưu lại ngày và địa chỉ để đến với chúng mình nhé.</p>
        </div>
        <div className="venue-details">
          <div className="event-date">
            <p>{weddingContent.weddingDate}</p>
            <time>{weddingContent.weddingTime}</time>
          </div>
          <div className="venue-address">
            <SectionEyebrow>Địa điểm tổ chức</SectionEyebrow>
            <h3>{weddingContent.venueName}</h3>
            <address className="section-copy">{weddingContent.venueAddress}</address>
            <a className="text-link" href={weddingContent.venueMapUrl} target="_blank" rel="noopener noreferrer" aria-label={`Mở bản đồ đến ${weddingContent.venueName} trong thẻ mới`}>Mở bản đồ</a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
