# Các chức năng chính

---

## 1. Worker

### 1.1 Đăng nhập / Đăng xuất
- Đăng nhập bằng tài khoản nội bộ (email + mật khẩu) hoặc SSO công ty.
- Tự động đăng xuất sau thời gian không hoạt động.

### 1.2 Xem lịch đưa đón cá nhân
- Hiển thị lịch đưa đón theo tuần, lọc theo ca (Ca sáng / Ca chiều / Ca hành chính).
- Mỗi chuyến hiển thị: giờ đón dự kiến, tên tài xế, biển số xe, điểm đón, trạng thái chuyến.

### 1.3 Đăng ký lịch đưa đón hàng tuần
- Mỗi tuần, công nhân đăng ký lịch đưa đón cho tuần tiếp theo.
- **Deadline:** Thứ 3 hàng tuần (VD: thứ 3 tuần này đăng ký cho tuần sau).
- Công nhân chọn các ngày cần đưa/đón và ca làm việc tương ứng.
- Sau deadline, lịch được khóa và chuyển sang Dispatcher để lập tuyến.

### 1.4 Hủy chuyến (Cancel Booking)
- Công nhân có thể hủy một chuyến đã đăng ký.
- **Điều kiện:** Hủy trước giờ xe khởi hành ít nhất 30–60 phút (cấu hình bởi Admin).
- Sau khi hủy, hệ thống tự động thông báo cho Dispatcher để cân nhắc điều tiết xe.
- Hiển thị lý do hủy (nghỉ phép / đổi ca / lý do khác).

### 1.5 Check-in lên xe bằng QR code
- Khi lên xe, công nhân mở app và quét mã QR của chuyến xe tương ứng.
- Hệ thống ghi nhận thời gian và vị trí check-in.
- **Điều kiện hợp lệ:** Chỉ check-in được khi xe đang ở gần điểm đón (bán kính tối đa cấu hình bởi Admin, VD: 200m).

### 1.6 Theo dõi vị trí xe theo thời gian thực
- Xem vị trí xe trên bản đồ khi chuyến đang chạy.
- Xem thông tin xe: biển số, tên tài xế, số điện thoại tài xế.
- Xem thời gian dự kiến xe đến điểm đón (ETA).

### 1.7 Nhận thông báo (Push Notification)
- **Thông báo xe đến gần:** Khi xe còn cách điểm đón của công nhân một khoảng cấu hình sẵn (VD: 5 phút hoặc 2km).
- **Thông báo xe đã đến:** Khi xe đến điểm đón.
- **Thông báo xe khởi hành:** Khi xe rời điểm đón cuối cùng (nếu cần).
- **Thông báo sự cố:** Khi xe gặp sự cố, tài xế gửi cảnh báo đến toàn bộ công nhân trên lộ trình.
- **Thông báo hủy/thay đổi chuyến:** Khi Dispatcher điều chỉnh lịch.

### 1.8 Báo cáo lỡ chuyến
- Công nhân bấm nút "Tôi đã lỡ chuyến" khi không kịp lên xe.
- Hệ thống gửi thông báo cho Dispatcher để điều phối xe khác nếu có thể.
- Ghi nhận lịch sử lỡ chuyến của công nhân.

---

## 2. Driver (Tài xế)

### 2.1 Đăng nhập / Đăng xuất
- Đăng nhập bằng tài khoản được Admin cấp.
- Chỉ hiển thị các chức năng liên quan đến ca đang làm hoặc sắp tới.

### 2.2 Check-in / Check-out ca làm việc
- **Check-in:** Xác nhận bắt đầu ca, ghi nhận thời gian và vị trí xuất phát.
- **Check-out:** Xác nhận kết thúc ca, ghi nhận thời gian và vị trí kết thúc.
- Dữ liệu dùng để tính thời gian làm việc và báo cáo vận hành.

### 2.3 Xem lộ trình và danh sách điểm đón
- Hiển thị danh sách điểm đón theo thứ tự lộ trình tối ưu.
- Mỗi điểm đón hiển thị: địa chỉ, số công nhân cần đón, giờ đến dự kiến.
- Tài xế có thể đánh dấu từng điểm: "Đã đến" / "Đã đón xong" / "Bỏ qua" (khi không có công nhân).

### 2.4 Dẫn đường qua Google Maps
- Bấm vào điểm đón để mở Google Maps với tọa độ đích được điền sẵn.
- Hỗ trợ điều hướng từng chặng theo thứ tự lộ trình.

### 2.5 Gửi vị trí GPS liên tục
- App tự động gửi tọa độ GPS lên server mỗi 5 giây khi ca đang chạy.
- Dừng gửi vị trí sau khi tài xế check-out.

### 2.6 Báo cáo sự cố (Emergency / Incident)
- Tài xế bấm nút "Báo sự cố" và chọn loại: Xe hỏng / Tắc đường nghiêm trọng / Tai nạn / Khác.
- Hệ thống tự động:
  - Thông báo ngay cho Dispatcher.
  - Thông báo cho tất cả công nhân đang chờ ở các điểm tiếp theo trên lộ trình.
- Dispatcher tiếp nhận và xử lý: điều xe khác hoặc thông báo hủy chuyến.

### 2.7 Báo cáo nhiên liệu
- Tài xế nhập mức xăng hiện tại và số tiền đã đổ xăng sau mỗi ca hoặc khi cần thiết.
- Dữ liệu được lưu để Admin theo dõi chi phí vận hành.

---

## 3. Dispatcher (Điều phối viên)

### 3.1 Import danh sách công nhân
- Upload file Excel chứa danh sách công nhân đã đăng ký, bao gồm: họ tên, địa chỉ đón, ca làm việc.
- Hệ thống tự động geocode địa chỉ sang tọa độ GPS.
- Dispatcher kiểm tra và xác nhận dữ liệu trước khi tạo lộ trình.

### 3.2 Nhập số lượng xe và tài xế khả dụng
- Dispatcher nhập hoặc xác nhận số xe và tài xế có thể điều động cho từng ca.
- Hệ thống hiển thị tổng số công nhân cần đưa đón và gợi ý số xe tối thiểu cần thiết.

### 3.3 Tối ưu hóa lộ trình tự động (Route Optimization)
- Hệ thống tự động phân nhóm công nhân và gợi ý lộ trình tối ưu dựa trên:
  - Tọa độ các điểm đón.
  - Sức chứa của từng xe.
  - Thời gian giới hạn công nhân phải đến nhà máy (deadline ca).
  - Thời gian di chuyển thực tế (Google Maps API).
- Dispatcher xem kết quả gợi ý, có thể điều chỉnh thủ công nếu cần, sau đó xác nhận và gửi lộ trình cho tài xế.

### 3.4 Theo dõi bản đồ thời gian thực
- Xem vị trí tất cả xe đang chạy trên bản đồ.
- Xem trạng thái từng xe: đang di chuyển / đang dừng / sự cố / chưa bắt đầu.
- Xem danh sách công nhân đã check-in / chưa check-in theo từng chuyến.

### 3.5 Xử lý hủy chuyến và lỡ chuyến
- Nhận thông báo khi công nhân hủy chuyến hoặc báo lỡ chuyến.
- Đánh giá và quyết định: giữ nguyên lộ trình hoặc điều chỉnh (bỏ bớt điểm đón, gộp xe...).
- Thông báo lại cho tài xế và công nhân liên quan.

### 3.6 Xử lý sự cố xe
- Nhận cảnh báo từ tài xế khi có sự cố.
- Điều xe dự phòng (nếu có) hoặc thông báo hủy chuyến cho công nhân còn lại trên lộ trình.
- Ghi nhận sự cố vào hệ thống.

---

## 4. Admin (Quản trị viên)

### 4.1 Quản lý danh mục
- **Xe:** Thêm/sửa/xóa xe (biển số, sức chứa, loại xe, nhà thầu sở hữu).
- **Tài xế:** Thêm/sửa/xóa tài xế, gán xe mặc định.
- **Điểm đón:** Quản lý danh sách điểm tập kết/điểm đón cố định.
- **Nhà thầu vận tải:** Quản lý thông tin đơn vị cung cấp xe thuê ngoài (nếu có).
- **Công nhân:** Xem danh sách công nhân, phân ca, trạng thái tài khoản.

### 4.2 Cấu hình hệ thống
- Cấu hình deadline đăng ký lịch hàng tuần (mặc định: thứ 3).
- Cấu hình thời gian tối thiểu được phép hủy chuyến trước giờ xe chạy (VD: 30 phút hoặc 60 phút).
- Cấu hình bán kính hợp lệ để check-in QR (VD: 200m tính từ điểm đón).
- Cấu hình tần suất gửi vị trí GPS của tài xế.
- Cấu hình thông số thông báo (khoảng cách/thời gian kích hoạt thông báo xe đến gần).

### 4.3 Phân quyền tài khoản
- Tạo tài khoản cho Dispatcher, Driver, Worker.
- Gán vai trò và phân quyền tương ứng.
- Kích hoạt / vô hiệu hóa tài khoản.

### 4.4 Dashboard phân tích (Analytics)
- **Tỷ lệ lấp đầy xe (Occupancy Rate):** % số ghế được sử dụng theo ngày/tuần/tháng.
- **Chỉ số đúng giờ (On-time Performance):** % chuyến đến nhà máy đúng giờ.
- **Chi phí vận hành:** Chi phí xăng dầu, km vận hành, chi phí/công nhân/chuyến.
- **Tỷ lệ hủy chuyến:** Số lượng và lý do hủy chuyến theo thời gian.
- **Tỷ lệ lỡ chuyến:** Theo công nhân và theo tuyến đường.
- Lọc báo cáo theo ngày, tuần, tháng, ca làm việc, tuyến xe.

### 4.5 Lịch sử và tra cứu (Logs)
- Xem lại lịch sử di chuyển (GPS track) của bất kỳ xe nào trong khoảng thời gian tùy chọn.
- Xem log check-in của công nhân theo chuyến.
- Xem log sự cố và cách xử lý.
- Dùng để đối chiếu, giải quyết tranh chấp hoặc khiếu nại.
