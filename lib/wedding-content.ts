import { createGalleryMediaItems } from "./gallery-media-schema";

export const MAX_ATTENDEE_COUNT = Number.parseInt(process.env.MAX_ATTENDEE_COUNT ?? "10", 10);

export const GALLERY_STORAGE_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_PUBLIC_BASE_URL;

export const weddingContent = {
  coupleNames: "Minh & Hà",
  brideName: "Hà",
  groomName: "Minh",
  invitationMessage:
    "Trân trọng kính mời gia đình và bạn bè thân thương đến chung vui trong ngày hạnh phúc của chúng mình.",
  weddingDate: "Chủ Nhật, 24 tháng 11 năm 2026",
  weddingTime: "17:30",
  venueName: "White Palace",
  venueAddress: "194 Hoàng Văn Thụ, Phường 9, Quận Phú Nhuận, TP. Hồ Chí Minh",
  venueMapUrl: "https://maps.google.com/?q=White+Palace+Hoang+Van+Thu",
  attendeeLimit: Number.isFinite(MAX_ATTENDEE_COUNT) ? MAX_ATTENDEE_COUNT : 10,
  gallery: createGalleryMediaItems([
    {
      storageObjectPath: "photo-01.jpg",
      localFallbackPath: "/images/pre-wedding/pre-wedding-01.svg",
      altText: "Minh và Hà trong khoảnh khắc tiền cưới dưới nắng chiều",
      caption: "Ngày nắng dịu",
      displayOrder: 1
    },
    {
      storageObjectPath: "photo-02.jpg",
      localFallbackPath: "/images/pre-wedding/pre-wedding-02.svg",
      altText: "Minh và Hà trong khoảnh khắc tiền cưới bên hoa trắng",
      caption: "Một lời hẹn",
      displayOrder: 2
    },
    {
      storageObjectPath: "photo-03.jpg",
      localFallbackPath: "/images/pre-wedding/pre-wedding-03.svg",
      altText: "Minh và Hà trong khoảnh khắc tiền cưới trong khu vườn",
      caption: "Cùng về một nhà",
      displayOrder: 3
    }
  ], GALLERY_STORAGE_PUBLIC_BASE_URL)
} as const;
