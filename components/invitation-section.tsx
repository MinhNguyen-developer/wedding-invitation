import { ChevronDown } from "lucide-react";
import { EditorialPortrait } from "./editorial-portrait";
import { OpeningStage, ScrollReveal } from "./scroll-scenes";
import { SectionEyebrow } from "./ui";
import { weddingContent } from "@/lib/wedding-content";

export function InvitationSection({ guestName, albumHref = "/album" }: { guestName?: string; albumHref?: string }) {
  const [groom, bride] = weddingContent.coupleNames.split(" & ");

  return (
    <>
      <OpeningStage>
        {guestName ? <p className="stage-guest-greeting">Thân mời {guestName}</p> : <p className="stage-eyebrow">Trân trọng kính mời</p>}
        <h1 className="stage-title" aria-label={weddingContent.coupleNames}>
          <span>{groom}</span><em>&</em><span>{bride}</span>
        </h1>
        <p className="stage-date">{weddingContent.weddingDate}</p>
        <a className="stage-rsvp" href="#rsvp">Xác nhận tham dự</a>
        <a className="stage-scroll" href="#thiep-cuoi" aria-label="Khám phá lời mời">
          <span>Cuộn để mở lời hẹn</span><ChevronDown aria-hidden="true" size={18} strokeWidth={1} />
        </a>
      </OpeningStage>

      <section id="thiep-cuoi" className="editorial-section" aria-label="Thiệp cưới của Quốc Minh và Nhật Hà">
        <div className="section-shell">
          <div className="editorial-masthead"><span>Chuyện chúng mình</span><span>Ngày chung đôi</span></div>
          <div className="editorial-cover">
            <ScrollReveal className="editorial-intro">
              <SectionEyebrow>Một lời hẹn trăm năm</SectionEyebrow>
              <h2 className="cover-title" aria-label={`Chuyện của ${weddingContent.coupleNames}`}>
                <span>{groom}</span><em>&</em><span>{bride}</span>
              </h2>
              <p className="cover-deck">Từ hôm nay,<br /><em>và mãi về sau.</em></p>
              <a href={albumHref} className="text-link">Những khoảnh khắc của chúng mình</a>
            </ScrollReveal>
            <figure className="cover-figure">
              <EditorialPortrait photo={weddingContent.gallery[0]} />
              <figcaption><span>Mình cùng viết tiếp</span><span>Một câu chuyện yêu thương</span></figcaption>
            </figure>
          </div>
          <ScrollReveal className="invitation-letter">
            <SectionEyebrow>Gửi những người chúng mình yêu quý</SectionEyebrow>
            <h3 className="letter-heading">Ngày vui, <em>có bạn.</em></h3>
            <p className="letter-body">{weddingContent.invitationMessage}</p>
            <div className="letter-signature">{weddingContent.groomName} & {weddingContent.brideName}</div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
