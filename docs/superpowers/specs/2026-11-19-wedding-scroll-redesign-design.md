# Thiết kế thiệp cưới hai màn: Quốc Minh & Nhật Hà

Ngày: 19/11/2026

Trạng thái: Người dùng đã duyệt bằng “Hãy triển khai”; đã triển khai trên nhánh `codex/wedding-scroll-redesign`.

## Mong muốn đã xác nhận

Người dùng muốn thiết kế lại website hiện tại, lấy cảm hứng từ Cartier Watches & Wonders và Oryzo. Hai phẩm chất quan trọng nhất là **chuyển động khi cuộn** và **sự sang trọng**. Người dùng chọn kết hợp thành **hai màn: sân khấu mở màn và tạp chí ảnh cưới**.

Mục tiêu là một thiệp cưới có cảm xúc, trang trọng, dễ đọc và dễ phản hồi đối với người thân, bạn bè. Thành công khi phần mở màn tạo ấn tượng và khách vẫn tìm được ngày, giờ, địa điểm, RSVP nhanh chóng.

## Các hướng đã cân nhắc

1. **Chỉ sân khấu mở màn:** rèm champagne chuyển động theo thao tác cuộn, bố cục trang trọng; hoạt động tốt cả khi chưa có ảnh thật. Phần ảnh ít đóng vai trò dẫn chuyện.
2. **Chỉ tạp chí ảnh cưới:** ảnh lớn, chữ serif và khoảng trắng; có cảm giác gần gũi, nhưng cần bộ ảnh thật để đạt hiệu quả tốt nhất.
3. **Kết hợp hai màn — lựa chọn của người dùng:** sân khấu tạo nghi thức mở thiệp, tạp chí tiếp nối câu chuyện và thông tin. Cần kiểm soát độ dài đoạn mở màn để khách không phải cuộn quá lâu mới xem được nội dung.

## Phạm vi và những gì cần giữ

Thiết kế lại điều hướng, phần mở đầu, trình bày lời mời, album, địa điểm, biểu mẫu và chân trang. Giữ thông tin trong `lib/wedding-content.ts` làm nguồn nội dung duy nhất: Quốc Minh & Nhật Hà, 23/01/2027, 10:30, Promes Center và địa chỉ hiện tại.

Giữ các liên kết `#loi-moi`, `#album`, `#dia-diem`, `#rsvp`; thao tác đến RSVP và bản đồ vẫn trực tiếp. Giữ hợp đồng `/api/rsvp`, quy tắc xác thực, lựa chọn không tham dự, số người tối đa, lời nhắn, trạng thái gửi, thành công và lỗi. Thông tin phản hồi của khách vẫn riêng tư.

Không bổ sung tài khoản, thanh toán, lời chúc công khai, nhạc tự phát, công cụ quản trị hay thay đổi nơi lưu RSVP. Công việc thực hiện trong repository hiện tại; xuất bản và cấu hình dịch vụ nằm ngoài phạm vi lần thiết kế này.

## Hai màn hình

### Màn 1 — Sân khấu mở thiệp

Khung nhìn đầu tiên chiếm toàn màn hình. Nền rèm champagne có nếp gấp và ánh sáng dịu. Chính giữa là tên Quốc Minh & Nhật Hà bằng serif thanh lịch, lời mời ngắn và ngày cưới. Điều hướng gọn phía trên; nút xác nhận tham dự luôn có thể truy cập mà không phải hoàn thành hiệu ứng.

Khi khách cuộn, hai cánh rèm tách dần sang hai bên, hé lộ biểu tượng chữ M / H và một khoảng sáng ở giữa. Tên và lời mời chuyển nhẹ về trạng thái kết thúc; chuyển động kết thúc trước khi màn tạp chí đi vào khung nhìn. Đây là chuyển động gắn với vị trí cuộn, có thể đảo ngược khi cuộn lên.

Đề xuất của người thiết kế: desktop dùng vùng mở màn khoảng 170–190svh với khung sân khấu sticky 100svh; điện thoại khoảng 130–150svh. Người triển khai chọn khoảng chính xác sau kiểm tra thực tế. Không chiếm quyền cuộn, không yêu cầu kéo chuột, không khóa trang khi animation đang chạy.

Sau phản hồi của người dùng về việc thiếu 3D, sân khấu được nâng lên WebGL/Three.js: rèm là lưới hình học có nếp gấp và vật liệu vải, mở ra cặp nhẫn vàng trong không gian vòm, với ánh sáng phản xạ và camera phối cảnh di chuyển theo cuộn. CSS/SVG giữ vai trò dự phòng khi WebGL không khả dụng, mất ngữ cảnh, JavaScript không chạy hoặc người xem yêu cầu giảm chuyển động.

### Màn 2 — Tạp chí ảnh cưới

Một bìa tạp chí lớn tiếp nối sân khấu: tên cặp đôi có kích thước nổi bật, ảnh chân dung trong khung hình chữ nhật tinh gọn, ngày cưới và một câu dẫn ngắn. Trên desktop, ảnh và chữ bố trí bất đối xứng; trên điện thoại, thứ tự đọc là tên, ảnh, thông tin. Ảnh có thể dịch chuyển chậm một khoảng nhỏ trong khung khi cuộn.

Phần tạp chí tiếp tục bên dưới, không ép mọi nội dung vào một viewport:

- Lời mời tiếng Việt trên nền sáng, chữ dễ đọc, độ dài dòng vừa phải.
- Album ảnh lớn với chú thích, điều khiển trước/sau rõ ràng và thao tác vuốt đang có.
- Ngày giờ và địa điểm trình bày theo hàng cột với đường phân cách mảnh; đường dẫn bản đồ dễ thấy.
- RSVP trên một vùng nền burgundy hoặc nền sáng tương phản rõ, biểu mẫu có nhãn đầy đủ và nút gửi nổi bật.
- Chân trang với tên cặp đôi và lời cảm ơn ngắn.

Ảnh chỉ lấy từ tập ảnh đang được quản lý trong dự án. Hiện repository dùng ảnh SVG giữ chỗ; khi chưa có ảnh thật, bìa dùng bố cục chữ M / H và đường nét trang trí, album thông báo đang chuẩn bị. Không tạo ảnh người giả và không dùng ảnh cặp đôi khác. Khi có ảnh thật, thiết kế tự dùng nguồn ảnh hiện hữu. Ảnh lỗi có trạng thái thay thế dễ hiểu.

## Ngôn ngữ thị giác

- Nền ivory `#F7F3EB`, giấy sáng `#FFFDF8`, champagne `#D4C0A0`.
- Điểm nhấn burgundy `#651F2D`, chữ chính `#2D2825`; màu chữ phụ được chọn theo độ tương phản, không chỉ theo độ nhạt.
- Serif tương phản nét cho tiêu đề; sans serif gọn, dễ đọc cho nội dung và biểu mẫu. Giữ hệ biến font hiện có; người triển khai chọn font hỗ trợ dấu tiếng Việt, ưu tiên tài nguyên đã có và tránh phụ thuộc tải font lúc dựng trang.
- Khoảng trắng rộng, bố cục có chủ ý, đường viền mảnh, góc bo nhỏ. Hạn chế thẻ nổi, khối pill và bóng đổ dày đang có.
- Nội dung chính tối thiểu 16px; tiêu đề co giãn theo viewport, có khoảng trên/dưới để không cắt dấu tiếng Việt.

Các màu là định hướng thị giác; người triển khai điều chỉnh cặp màu nếu phép đo tương phản không đạt chuẩn. Các cặp màu đặc đã kiểm tra: ink/ivory 13,16:1, burgundy/paper 11,56:1, ink/champagne 8,22:1. Cần đo riêng chữ trên nền rèm hoặc ảnh khi triển khai.

## Chuyển động và khả năng truy cập

Dùng giá trị cuộn của Framer Motion để điều khiển cảnh Three.js, đồng thời giữ các chuyển tiếp chữ và tạp chí. Các phần tạp chí chỉ hiện lên nhẹ trong lần xuất hiện đầu; không chuyển động lặp vô hạn. Không cập nhật React state trên từng khung hình. Giới hạn pixel ratio của canvas ở 1,5; ngừng render khi sân khấu ở ngoài màn hình hoặc tab bị ẩn; thu hồi geometry, material, texture, shadow map, renderer và các listener khi tháo component.

Với `prefers-reduced-motion`, bỏ mở rèm, parallax và chiều dài cuộn dành riêng cho animation; cả hai màn hiển thị tĩnh theo thứ tự đọc. Không để nội dung bị ẩn nếu JavaScript chưa chạy hoặc không chạy. Trang, nút và form vẫn hoạt động trong lúc chuyển động.

Giữ skip link, heading có thứ bậc, focus rõ, nhãn form và thông báo trạng thái cho trình đọc màn hình. Các lớp rèm không chặn chuột và bị ẩn khỏi accessibility tree. Điều hướng cố định không che phần tử đang focus hay đích anchor. Nút có vùng bấm tối thiểu 44×44 CSS px; ảnh có mô tả phù hợp. Không có cuộn ngang ở 375px và khi xoay ngang.

## Cách triển khai và kiểm chứng

Tiếp tục dùng Next.js 15, React 19, Tailwind, Framer Motion, Embla và Lucide hiện có; bổ sung Three.js 0.187.0 cùng khai báo kiểu tương ứng để đáp ứng yêu cầu 3D thật. Renderer được tải riêng khi sân khấu vào màn hình. Phần chuyển động cuộn sở hữu trong component client nhỏ; nội dung và bố cục vẫn server-rendered. Không thêm thư viện cuộn mượt hay React Three Fiber.

Kiểm tra tên/ngày/giờ/địa điểm, anchor đến RSVP và bản đồ, album có/không có ảnh/lỗi ảnh, form hợp lệ/không hợp lệ/lỗi kết nối, chế độ giảm chuyển động và bố cục 375/768/1440px. Kiểm chứng typecheck, các bài kiểm thử liên quan và production build.

Hiện trạng trước sửa: `npm run typecheck` đạt; unit test chưa chạy được vì Vitest không resolve alias `@/` trong đường dẫn dự án có khoảng trắng. Một số bài kiểm thử giao diện còn dùng dữ liệu mẫu cũ. Người triển khai cần xử lý phần cấu hình/kiểm thử trực tiếp cản trở việc kiểm chứng thay đổi này, đồng thời phân biệt lỗi có trước với lỗi phát sinh.

Trình duyệt CUA hiện không khả dụng. Nếu tình trạng này tiếp diễn, báo rõ giới hạn kiểm tra trực quan; không khẳng định đã kiểm tra animation hoặc responsive bằng trình duyệt.

## Những lựa chọn do người thiết kế đề xuất

“Hai màn” được hiểu là hai cảnh nối tiếp trên cùng một trang cuộn, thay vì hai URL riêng. Phần tạp chí có thể dài hơn một viewport để chứa đủ thông tin và RSVP. Palette champagne / ivory / burgundy, kỹ thuật CSS/SVG cho rèm và phạm vi local repository là đề xuất đã được duyệt cùng bản thiết kế.

## Tư liệu tham khảo

Kiểm chứng sau nâng cấp WebGL: 24/24 unit test, 44/44 kiểm thử trình duyệt và production build đạt. Mười kiểm thử cảnh 3D, lỗi GPU, đổi lựa chọn chuyển động và đường dẫn RSVP cũng đạt trên production build tách biệt. Đã xem ảnh render WebGL thực tế ở viewport desktop và điện thoại. Giữ ổn định chiều cao từ CSS ban đầu để native anchor không lệch sau hydration; mọi liên kết menu có vùng bấm tối thiểu 44×44px. Các phát hiện về shader và cập nhật giảm chuyển động từ rà soát đã được sửa và kiểm chứng. Không còn phát hiện quan trọng chưa xử lý.

Ảnh thật chưa được cấu hình nên bìa hiển thị monogram và album thông báo đang chuẩn bị. Các kiểm thử RSVP dùng phản hồi giả lập; không gửi phản hồi thật vào Google Sheets. Mã nằm trong workspace hiện tại trên nhánh `codex/wedding-scroll-redesign`.

- Cartier: https://www.cartier.com/watchesandwonders — URL hiện tại chặn truy cập tự động.
- Tư liệu của đơn vị thiết kế Cartier 2024: https://immersive-g.com/projects/cartier-watches-and-wonders-24/ — rèm mở màn và cách kể chuyện bằng thao tác cuộn; không coi tư liệu 2024 là ảnh chụp trực tiếp website hiện tại.
- Oryzo: https://oryzo.ai/ — bố cục có chữ lớn, vật thể trung tâm và hành trình liên tục qua các phần.
- Ảnh tham khảo Oryzo: https://www.designrush.com/best-designs/websites/oryzo-website-design.
- Đã tra cứu ui-ux-pro-max: kết quả tự động chỉ phù hợp một phần (kể chuyện khi cuộn và cặp font serif/sans); các gợi ý Soft UI/Liquid Glass không phù hợp thiệp cưới này. Không lưu kết quả tự động thành design system; thiết kế ở trên là phương án biên tập theo yêu cầu người dùng và tư liệu thực tế.
