import { createGalleryMediaItems } from "./gallery-media-schema";

export const MAX_ATTENDEE_COUNT = Number.parseInt(
  process.env.MAX_ATTENDEE_COUNT ?? "10",
  10,
);

export const GALLERY_STORAGE_PUBLIC_BASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_PUBLIC_BASE_URL;

export const weddingContent = {
  coupleNames: "Quốc Minh & Nhật Hà",
  brideName: "Hà",
  groomName: "Minh",
  invitationMessage:
    "Ngày vui của chúng con sẽ thật trọn vẹn và ý nghĩa hơn nếu có sự hiện diện của ông bà, bố mẹ, người thân và những người bạn mà chúng con luôn yêu quý.\n\nThân mời mọi người đến chung vui, và cùng chúng con lưu lại những khoảnh khắc thật vui trong ngày đặc biệt này nhé!",
  weddingDate: "Thứ 7, 23 tháng 01 năm 2027",
  weddingTime: "10:30",
  venueName: "Promes Center",
  venueAddress: "122 - 124, Đ. Xuân Thủy, Cầu Giấy, Hà Nội",
  venueMapUrl: "https://maps.app.goo.gl/Q2ScSkPnfkteamCv6",
  attendeeLimit: Number.isFinite(MAX_ATTENDEE_COUNT) ? MAX_ATTENDEE_COUNT : 10,
  gallery: createGalleryMediaItems(
    [
      {
        storageObjectPath: "photo-01.jpg",
        localFallbackPath: "/images/pre-wedding/pre-wedding-01.svg",
        altText: "Minh và Hà trong khoảnh khắc tiền cưới dưới nắng chiều",
        caption: "Ngày nắng dịu",
        displayOrder: 1,
      },
      {
        storageObjectPath: "photo-02.jpg",
        localFallbackPath: "/images/pre-wedding/pre-wedding-02.svg",
        altText: "Minh và Hà trong khoảnh khắc tiền cưới bên hoa trắng",
        caption: "Một lời hẹn",
        displayOrder: 2,
      },
      {
        storageObjectPath: "photo-03.jpg",
        localFallbackPath: "/images/pre-wedding/pre-wedding-03.svg",
        altText: "Minh và Hà trong khoảnh khắc tiền cưới trong khu vườn",
        caption: "Cùng về một nhà",
        displayOrder: 3,
      },
    ],
    GALLERY_STORAGE_PUBLIC_BASE_URL,
  ),
} as const;
