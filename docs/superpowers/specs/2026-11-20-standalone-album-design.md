# Album ảnh riêng với hành trình cuộn 3D

Người dùng yêu cầu album là một trang riêng, khoảng 10 ảnh demo, tất cả có hiệu ứng cuộn và animation 3D lấy cảm hứng từ Cartier Watches & Wonders. Đây là phần tiếp nối hướng sang trọng đã duyệt; ảnh demo sẽ được thay bằng ảnh thật sau.

Triển khai `/album` với đúng 10 ảnh demo local. Mỗi ảnh là một chương cao một màn hình; cuộn tự nhiên điều khiển camera đi xuyên qua không gian ảnh, ảnh xoay dần vào khung nhìn, các lớp vòm và bệ tạo chiều sâu. Ba không gian champagne, giấy sáng và burgundy chuyển dần theo hành trình. Dùng lại Three.js và vòng đời canvas hiện có, một canvas cho toàn album, không thêm engine hay chặn cuộn.

Thay album vòng cung trên trang chính bằng một lời giới thiệu và liên kết mở album. Menu và liên kết bìa dẫn trực tiếp `/album`. Trang album có đường về thiệp cưới và RSVP; native anchor và nút trước/sau cho phép đi tới từng ảnh. Mỗi ảnh có URL fragment riêng.

Phương án carousel cũ không còn phù hợp yêu cầu cuộn toàn trang; tạo mười canvas riêng làm tăng GPU và tải tài nguyên. Chọn một cảnh liên tục dùng progress cuộn, còn ảnh/chú thích HTML luôn được server-render để dùng khi thiếu/mất GPU hoặc không JavaScript. Fallback có CSS perspective theo cuộn; ảnh lỗi có thông báo và không làm mất ảnh khác.

Ảnh demo được ghi nhãn minh họa, nguồn giữ trong `public/images/demo/SOURCES.md`. Tiếp tục ánh xạ `photo-01.jpg` đến `photo-10.jpg` và metadata trong `lib/wedding-content.ts`; cấu hình nguồn ảnh thật tự bỏ nhãn demo. Luôn bật motion theo yêu cầu trước, giới hạn DPR 1,5, dừng render khi tab ẩn hoặc canvas ra ngoài màn hình, thu hồi tài nguyên khi đổi trang.

Không thay RSVP, thông tin cưới, backend hay xuất bản. Kiểm chứng trang riêng, đủ 10 ảnh, animation/pixel thay đổi khi cuộn qua mọi ảnh, nút/fragment, đường về RSVP, thiếu/mất GPU, ảnh lỗi, không JS, desktop/mobile/landscape, typecheck/unit/lint và production build tách biệt.

Kết quả: `/album` đã có 10 ảnh demo và 10 chương cuộn WebGL. Typecheck, lint, 25 unit test, 66 kiểm thử trình duyệt trên production và production build đạt. Đã kiểm tra riêng pixel GPU qua mọi ảnh, xoay màn hình, fragment, ảnh lỗi, thiếu/mất GPU và không JavaScript; không còn phát hiện rà soát chưa xử lý.
