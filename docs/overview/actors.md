# Actors chính

## 1. Worker (Công nhân)
**Mô tả:** Người sử dụng dịch vụ xe đưa đón. Mỗi công nhân có ca làm việc cố định hoặc thay đổi theo tuần.

**Trách nhiệm:**
- Đăng ký lịch đưa đón hàng tuần trước deadline.
- Hủy chuyến khi nghỉ phép hoặc thay đổi ca (trước giờ xe chạy ít nhất 30–60 phút).
- Check-in bằng QR code khi lên xe để xác nhận có mặt.
- Theo dõi vị trí xe và nhận thông báo khi xe đến điểm đón.
- Báo cáo lỡ chuyến để dispatcher điều phối kịp thời.

---

## 2. Driver (Tài xế)
**Mô tả:** Người thực hiện lộ trình đưa đón được phân công. Tài xế sử dụng app để nhận lộ trình và cập nhật trạng thái trong suốt ca làm việc.

**Trách nhiệm:**
- Nhận và thực hiện lộ trình do hệ thống phân công.
- Check-in/check-out để ghi nhận thời gian làm việc.
- Gửi vị trí GPS liên tục (mỗi 5 giây) trong suốt ca.
- Cập nhật trạng thái tại từng điểm đón (đã đến, đã đón xong).
- Báo cáo sự cố (xe hỏng, tắc đường, tai nạn) cho dispatcher và các worker liên quan.
- Báo cáo mức nhiên liệu và chi phí xăng sau mỗi ca.

---

## 3. Dispatcher (Điều phối viên)
**Mô tả:** Người chịu trách nhiệm lập kế hoạch vận chuyển hàng tuần và xử lý các tình huống phát sinh trong ca.

**Trách nhiệm:**
- Import danh sách công nhân và địa chỉ từ file Excel.
- Xác nhận số lượng xe và tài xế khả dụng cho từng ca.
- Kích hoạt thuật toán tối ưu hóa lộ trình và duyệt kết quả trước khi gửi cho tài xế.
- Theo dõi trạng thái xe và công nhân trên bản đồ thời gian thực.
- Xử lý hủy chuyến đột xuất, lỡ chuyến, và sự cố xe trong ca.
- Điều phối lại xe khi có sự cố hoặc thay đổi số lượng công nhân.

---

## 4. Admin (Quản trị viên)
**Mô tả:** Người quản lý toàn bộ hệ thống. Có quyền cao nhất, chịu trách nhiệm cấu hình hệ thống, quản lý danh mục dữ liệu và xem báo cáo tổng thể.

**Trách nhiệm:**
- Quản lý danh sách xe, tài xế, điểm đón, và nhà thầu vận tải.
- Cấu hình các thông số hệ thống (giờ ca, deadline đăng ký, quy tắc hủy chuyến...).
- Xem báo cáo KPI: tỷ lệ đúng giờ, tỷ lệ lấp đầy xe, chi phí/km.
- Truy xuất lịch sử di chuyển của xe để xử lý tranh chấp hoặc khiếu nại.
- Phân quyền tài khoản cho Dispatcher, Driver, Worker.
