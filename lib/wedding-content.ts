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
        localFallbackPath: "/images/demo/wedding-01.jpg",
        demoAltText: "Ảnh demo: cặp đôi trong lễ cưới ngoài trời",
        altText: "Minh và Hà trong khoảnh khắc tiền cưới dưới nắng chiều",
        caption: "Ngày nắng dịu",
        displayOrder: 1,
      },
      {
        storageObjectPath: "photo-02.jpg",
        localFallbackPath: "/images/demo/wedding-02.jpg",
        demoAltText: "Ảnh demo: cặp đôi và bó hoa cưới dưới nắng chiều",
        altText: "Minh và Hà trong khoảnh khắc tiền cưới bên hoa trắng",
        caption: "Một lời hẹn",
        displayOrder: 2,
      },
      {
        storageObjectPath: "photo-03.jpg",
        localFallbackPath: "/images/demo/wedding-03.jpg",
        demoAltText: "Ảnh demo: lối đi và vòm hoa trong khu vườn lễ cưới",
        altText: "Minh và Hà trong khoảnh khắc tiền cưới trong khu vườn",
        caption: "Cùng về một nhà",
        displayOrder: 3,
      },
      {
        storageObjectPath: "photo-04.jpg",
        localFallbackPath: "/images/demo/wedding-04.jpg",
        demoAltText: "Ảnh demo: cặp nhẫn vàng trên nền vải trắng",
        altText: "Ảnh cưới của Minh và Hà: chạm vào hạnh phúc",
        caption: "Chạm vào hạnh phúc",
        displayOrder: 4,
      },
      {
        storageObjectPath: "photo-05.jpg",
        localFallbackPath: "/images/demo/wedding-05.jpg",
        demoAltText: "Ảnh demo: cặp đôi trong lễ cưới với cánh hoa bay",
        altText: "Ảnh cưới của Minh và Hà: bên nhau qua những mùa",
        caption: "Bên nhau qua những mùa",
        displayOrder: 5,
      },
      {
        storageObjectPath: "photo-06.jpg",
        localFallbackPath: "/images/demo/wedding-06.jpg",
        demoAltText: "Ảnh demo: cặp đôi trên bãi biển dưới tấm voan",
        altText: "Ảnh cưới của Minh và Hà: dành cho nhau",
        caption: "Dành cho nhau",
        displayOrder: 6,
      },
      {
        storageObjectPath: "photo-07.jpg",
        localFallbackPath: "/images/demo/wedding-07.jpg",
        demoAltText: "Ảnh demo: đôi bàn tay đeo nhẫn cùng bó hoa cưới",
        altText: "Ảnh cưới của Minh và Hà: tình yêu ở lại",
        caption: "Tình yêu ở lại",
        displayOrder: 7,
      },
      {
        storageObjectPath: "photo-08.jpg",
        localFallbackPath: "/images/demo/wedding-08.jpg",
        demoAltText: "Ảnh demo: cặp đôi bên hồ trong ánh nắng",
        altText: "Ảnh cưới của Minh và Hà: ngày mình chung đôi",
        caption: "Ngày mình chung đôi",
        displayOrder: 8,
      },
      {
        storageObjectPath: "photo-09.jpg",
        localFallbackPath: "/images/demo/wedding-09.jpg",
        demoAltText: "Ảnh demo: hoa và những chiếc ly trên bàn tiệc",
        altText: "Ảnh cưới của Minh và Hà: mãi là chúng mình",
        caption: "Mãi là chúng mình",
        displayOrder: 9,
      },
      {
        storageObjectPath: "photo-10.jpg",
        localFallbackPath: "/images/demo/wedding-10.jpg",
        demoAltText: "Ảnh demo: không gian bàn tiệc với hoa và ánh sáng",
        altText: "Ảnh cưới của Minh và Hà: một đời thương nhau",
        caption: "Một đời thương nhau",
        displayOrder: 10,
      },
    ],
    GALLERY_STORAGE_PUBLIC_BASE_URL,
  ),
} as const;
