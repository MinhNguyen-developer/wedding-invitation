# Lời mời riêng cho từng khách

## Cập nhật theo yêu cầu tiếp theo của người dùng

Trang lời mời cá nhân điền sẵn nguyên tên đã lưu vào RSVP, cho phép chỉnh sửa trước khi gửi. Sau khi gửi thành công, form trở lại tên mặc định của người nhận. Thiệp chung vẫn để trống tên. Khi chuyển sang một người nhận khác, tạo form mới theo slug để không mang theo tên hoặc dữ liệu của khách trước.

Phần cập nhật này thay thế yêu cầu mật khẩu và biểu mẫu từng khách bên dưới: bỏ xác thực hoàn toàn ở `/tao-link` và API tạo link. Ai truy cập được trang đều có thể tạo lời mời; trang vẫn không nằm trong điều hướng của khách. Dùng textarea, mỗi dòng một khách; bỏ dòng trống, chuẩn hóa Unicode/khoảng trắng và gộp tên trùng trước giới hạn 100 khách mỗi lượt. Kiểm tra toàn bộ danh sách trước khi ghi. Tái sử dụng kho Google Sheets với một lần append cho tất cả khách mới và một batch update cho các slug trùng; giữ khả năng phục hồi khi thử lại. Trả danh sách từng tên/link, có sao chép riêng, mở thiệp và sao chép tất cả theo cặp tên + link. Giữ API một khách để các trang cũ đang mở vẫn dùng được. Không cần biến môi trường mật khẩu.

Người dùng muốn tự nhập khách bất kỳ, tạo link gọn như `/for/ban-hoang-anh`, và người nhận thấy nguyên văn “Thân mời bạn Hoàng Anh”. Người dùng đã chọn lưu tên trên hệ thống thay cho link mang tên trong query string. Không có danh sách khách được hardcode.

## Phương án và quyết định

- Link tự chứa tên không cần lưu trữ nhưng dài hơn; người dùng đã chọn link gọn có lưu trữ.
- Supabase đã có cấu hình nhưng project `wedding-invitation` đang tạm dừng. Khôi phục dự án không cần thiết để làm tính năng này.
- Lựa chọn triển khai của mình: tái sử dụng Google Sheets đang kết nối được cho RSVP. Tab `GuestLinks` riêng chứa ID, slug, tên hiển thị và thời gian tạo. Không sửa tab RSVP.

## Cách dùng

Trang `/tao-link` gồm ô “Xưng hô và tên khách”, mật khẩu quản lý, lời mời xem trước, nút tạo, sao chép và mở thiệp. Nhập toàn bộ cách xưng hô tự do, ví dụ “cô Hằng” hoặc “gia đình chú Sơn”. Mật khẩu lấy từ biến server `INVITATION_ADMIN_PASSWORD`; chỉ giữ trong trạng thái tab, không lưu vào URL hoặc trình duyệt. Không có tài khoản khách hay danh sách khách công khai.

Tên được chuẩn hóa Unicode NFC và khoảng trắng, giới hạn 120 ký tự. Slug bỏ dấu, chuyển đ thành d và dùng dấu gạch nối. Giữ nguyên cách viết tên để hiển thị. Với slug trùng, hàng đầu tiên giữ slug gốc; hàng sau nhận hậu tố ID duy nhất. Tạo lại cùng tên trả về link đã lưu. Mọi lần trả link phải kiểm tra quyền sở hữu slug, kể cả khi khôi phục một lần tạo bị ngắt giữa chừng. Việc append của Google Sheets xác định thứ tự hàng; không dựa vào khóa trong một tiến trình Node để bảo vệ các lần tạo đồng thời.

Route `/for/[slug]` đọc tên ở server và dùng lại toàn bộ thiệp. Lời mời riêng xuất hiện trên sân khấu mở màn. Điều hướng đến album rồi trở về giữ đúng đường dẫn của khách. Link không tồn tại trả 404; lỗi lưu trữ có thông báo thử lại. Dữ liệu khách được cache ở server trong 60 giây, xóa cache khi tạo link. Không xuất dữ liệu danh sách qua API công khai; chỉ POST có mật khẩu mới ghi được. Tên được ghi bằng RAW và render bằng React text, không HTML.

Không thêm database, dependency, gửi tin, RSVP tracking, import hàng loạt hoặc chức năng sửa/xóa. Không deploy. Tạo mật khẩu ngẫu nhiên trong `.env.local` nếu chưa cấu hình, không commit bí mật. Kiểm chứng tích hợp trong tab kiểm thử tạm và chỉ xóa dữ liệu kiểm thử do tác vụ tạo ra.

Thành công khi chủ thiệp tạo được khách bất kỳ, sao chép link thật, mở lại link vẫn đúng dấu và cách xưng hô, không ghi nhầm khách khi trùng slug hoặc tạo đồng thời, và giao diện hiện có vẫn hoạt động trên desktop/mobile.
