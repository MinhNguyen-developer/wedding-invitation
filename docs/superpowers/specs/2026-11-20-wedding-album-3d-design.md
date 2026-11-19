# Mở rộng thiệp cưới với album 3D và ảnh demo

Ngày: 20/11/2026. Phạm vi: tiếp nối hướng hai màn đã duyệt theo yêu cầu thêm 3D và dùng ảnh demo trước của người dùng.

Album trở thành không gian trưng bày ảnh: các tấm ảnh có độ dày giấy, ánh sáng, bóng đổ và vị trí theo vòng cung. Tấm đang xem ở phía trước; nút trước/sau và vuốt đổi ảnh bằng chuyển động liên tục. Cuộn trang thay đổi góc nhìn và độ mở của vòng cung; con trỏ tạo độ nghiêng nhẹ. Tiêu đề và chú thích vẫn là HTML dễ đọc. Không chiếm quyền cuộn hoặc bắt hoàn thành animation để tới RSVP.

Bìa tạp chí dùng khung ảnh nhiều lớp có chiều sâu, nghiêng theo cuộn và con trỏ. Chuyển động trên điện thoại vẫn chạy theo cuộn, không phụ thuộc hover. Giữ palette champagne/ivory/burgundy và màn mở đầu đang có. Luôn bật chuyển động bất kể tùy chọn giảm chuyển động, theo yêu cầu trước.

Các cách cân nhắc: chỉ thêm CSS perspective vào carousel nhẹ hơn nhưng chưa tạo không gian 3D thật; thêm engine mới gây trùng lặp. Chọn Three.js đang cài cho album và CSS 3D cho bìa; dùng chung vòng đời canvas với sân khấu để quản lý resize, dừng ngoài màn hình, giới hạn DPR 1,5 và thu hồi GPU. Đây là lựa chọn triển khai của agent trong phạm vi người dùng yêu cầu.

Ba ảnh demo cưới tải vào repository, ghi rõ ảnh minh họa, có nguồn trong thư mục ảnh. Giữ các object path photo-01.jpg, photo-02.jpg, photo-03.jpg; khi có cấu hình Storage hiện hữu, tự dùng ảnh thật cùng alt text thật và bỏ nhãn demo. Không sửa cơ sở dữ liệu hay hợp đồng RSVP.

DOM carousel hiện có giữ vai trò nội dung ngữ nghĩa, điều khiển vuốt và dự phòng khi WebGL không có, tải ảnh lỗi hoặc mất context. Canvas không chặn tương tác. Không có JavaScript vẫn xem được cả ba ảnh. Các nút ít nhất 44px, điều khiển được bằng bàn phím, không cuộn ngang trang ở 375px hoặc landscape.

Kiểm chứng: dữ liệu demo/ảnh thật, ảnh lỗi; render canvas thật và thay đổi pixel theo tương tác; điều khiển album; thiếu/mất GPU; không JavaScript; bìa đổi phối cảnh khi cuộn; kiểm thử desktop/mobile, typecheck, unit và production build tách biệt.

Kết quả: đã triển khai album WebGL và bìa CSS 3D; 25 unit test, 58 kiểm thử trình duyệt, 14 kiểm thử production, typecheck, lint và production build đạt. Đã kiểm tra ảnh chụp desktop/điện thoại và sửa lỗi cắt chú thích trong HTML fallback do lượt rà soát độc lập phát hiện.
