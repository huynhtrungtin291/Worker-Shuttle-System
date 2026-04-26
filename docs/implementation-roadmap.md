Đây là tài liệu đã được chuyển sang tiếng Việt có dấu:

---

# Đề xuất thứ tự xây dựng hệ thống Shuttle

Tài liệu này đề xuất thứ tự triển khai theo hướng: xây nền tảng trước, rồi đến các chức năng có phụ thuộc, và cuối cùng là tối ưu/phân tích.

## Nguyên tắc sắp xếp

- Làm phần chung trước: auth, phân quyền, danh mục, cấu hình hệ thống.
- Làm quy trình cốt lõi trước: đăng ký lịch → lập tuyến → vận hành chuyến xe.
- Làm theo MVP trước, nâng cao sau.
- Mỗi phase phải có tiêu chí hoàn thành (DoD) rõ ràng.

## Tổng quan thứ tự (top-down)

1. Nền tảng hệ thống (Auth, Role, User, Audit, Config)
2. Danh mục vận hành (Xe, Tài xế, Điểm đón, Nhà thầu)
3. Đăng ký lịch Worker + khóa deadline
4. Dispatcher import + geocode + input nguồn lực
5. Route optimization + phê duyệt và phân chuyến
6. Driver app flow (ca làm, điểm đón, GPS)
7. Worker app flow khi vận hành (lịch, QR check-in, theo dõi xe, thông báo)
8. Xử lý ngoại lệ (hủy chuyến, lỡ chuyến, sự cố)
9. Dashboard + logs + báo cáo
10. Tối ưu, bảo mật, hiệu năng, hardening trước go-live

## Kế hoạch chi tiết theo phase

### Phase 0 - Khởi tạo nền tảng kỹ thuật

Mục tiêu: Có bộ khung backend chạy được, CI có test, conventions rõ ràng.

Hạng mục:

- Chuẩn hóa module NestJS theo domain: auth, users, worker-booking, dispatch, trips, tracking, notifications, reports.
- Cấu hình database + migration + seed data cơ bản.
- Logging, error format, validation DTO, pagination, filter chung.
- Swagger/OpenAPI và version API.

DoD:

- Chạy local được, có environment dev/staging.
- Có API health check, lint, unit test skeleton.

### Phase 1 - Auth, User, Role, Permissions (bắt buộc)

Mục tiêu: Tất cả vai trò đăng nhập và truy cập đúng quyền.

Hạng mục:

- Đăng nhập/đăng xuất (Worker, Driver, Dispatcher, Admin).
- RBAC: role + permission theo module.
->>>> Quản lý tài khoản (tạo, khóa/mở khóa, gán vai trò).
- Session timeout/auto logout policy.

DoD:

- Admin tạo tài khoản và gán role.
- Mọi endpoint được bảo vệ bởi guard theo role.

### Phase 2 - Danh mục & Cấu hình hệ thống (Admin)

Mục tiêu: Có dữ liệu nền để vận hành.

Hạng mục:

- CRUD: Xe, Tài xế, Điểm đón, Nhà thầu, Công nhân.
- Cấu hình hệ thống:
  - deadline đăng ký hàng tuần,
  - thời gian cho phép hủy chuyến,
  - bán kính check-in QR,
  - tần suất GPS,
  - thông số thông báo đến gần.

DoD:

- Tất cả tham số cấu hình đọc/ghi được và có giá trị mặc định.
- Danh mục có API tìm kiếm/lọc/phạm vi role.

### Phase 3 - Worker đăng ký lịch tuần (MVP cốt lõi)

Mục tiêu: Worker đăng ký lịch đưa đón cho tuần tiếp theo, hệ thống khóa sau deadline.

Hạng mục:

- Worker xem lịch theo tuần, theo ca.
- Đăng ký ngày + ca cho tuần sau.
- Có cơ chế khóa sau deadline.
- Lưu snapshot đăng ký để Dispatcher xử lý.

DoD:

- Không thể sửa đăng ký sau deadline.
- Dispatcher xem được tổng hợp nhu cầu theo ngày/ca.

### Phase 4 - Dispatcher chuẩn bị dữ liệu và nguồn lực

Mục tiêu: Chuẩn hóa input trước tối ưu tuyến.

Hạng mục:

- Import danh sách công nhân bằng Excel.
- Geocode địa chỉ sang tọa độ, xử lý địa chỉ lỗi.
- Nhập số xe/tài xế khả dụng theo ca.
- Tổng hợp nhu cầu và gợi ý số xe tối thiểu.

DoD:

- Tỷ lệ geocode thành công đạt mức chấp nhận được (VD >= 95%).
- Có màn hình/API xác nhận dữ liệu trước khi optimize.

### Phase 5 - Route Optimization + Phân chuyến

Mục tiêu: Tạo được chuyến xe tối ưu và giao đến Driver/Worker.

Hạng mục:

- Tối ưu hóa lộ trình dựa trên: tọa độ, sức chứa xe, deadline đến nhà máy, travel time.
- Cho phép Dispatcher điều chỉnh thủ công.
- Xác nhận kế hoạch và phân tài xế/xe.
- Tạo bản ghi chuyến xe + điểm đón + danh sách hành khách.

DoD:

- Sinh kế hoạch chuyến cho từng ca.
- Driver thấy được danh sách điểm đón ngay sau khi phân chuyến.

### Phase 6 - Driver vận hành chuyến (core runtime)

Mục tiêu: Driver có đầy đủ thao tác khi chạy chuyến.

Hạng mục:

- Check-in/check-out ca làm.
- Xem lộ trình, đánh dấu trạng thái điểm đón (đã đến/đã đón xong/bỏ qua).
- Mở Google Maps theo điểm đón.
- Gửi GPS liên tục khi đang chạy; dừng khi check-out.
- Báo sự cố (xe hỏng, tắc đường, tai nạn, khác).

DoD:

- Dispatcher nhìn thấy trạng thái xe realtime.
- GPS gửi đúng tần suất cấu hình.

### Phase 7 - Worker runtime experiences

Mục tiêu: Worker sử dụng trọn vẹn trong quá trình đón xe.

Hạng mục:

- Xem thông tin chuyến: tài xế, biển số, điểm đón, ETA.
- Theo dõi vị trí xe theo thời gian thực.
- QR check-in lên xe (có ràng buộc bán kính hợp lệ).
- Push notifications: xe đến gần, xe đã đến, thay đổi/hủy chuyến.

DoD:

- Check-in sai bán kính bị từ chối đúng rule.
- Push gửi đúng đối tượng và đúng sự kiện.

### Phase 8 - Xử lý ngoại lệ vận hành

Mục tiêu: Xử lý các trường hợp phát sinh thực tế.

Hạng mục:

- Worker hủy chuyến (có rule thời gian 30–60 phút trước giờ chạy).
- Worker báo lỡ chuyến.
- Dispatcher nhận thông báo, điều chỉnh lộ trình/gộp xe/bỏ điểm.
- Quy trình xử lý sự cố xe và thông báo hàng loạt.

DoD:

- Mọi sự kiện ngoại lệ đều có log, thông báo, và trạng thái xử lý.

### Phase 9 - Analytics, Logs, Tra cứu

Mục tiêu: Đầy đủ dữ liệu quản trị và đối soát.

Hạng mục:

- Dashboard: occupancy, on-time performance, chi phí vận hành, tỷ lệ hủy, tỷ lệ lỡ chuyến.
- Bộ lọc báo cáo theo ngày/tuần/tháng/ca/tuyến.
- Lịch sử GPS track, log check-in, log sự cố.

DoD:

- Có xuất báo cáo cơ bản + API tra cứu.
- Có thể đối soát 1 chuyến bất kỳ từ đầu đến cuối.

### Phase 10 - Hardening trước go-live

Mục tiêu: Sẵn sàng vận hành thật.

Hạng mục:

- Performance test cho module tracking/notification.
- Security hardening (rate limit, audit log, permission review).
- Backup/restore, monitoring, alerting.
- UAT với các role và scenario giờ cao điểm.

DoD:

- Đạt SLA nội bộ và checklist go-live.

## Thứ tự release đề nghị

- **Release 1 (MVP):** Phase 0 → 5
  - Kết quả: Hoàn thành quy trình đăng ký → lập tuyến → phân chuyến.
- **Release 2 (Vận hành thật):** Phase 6 → 8
  - Kết quả: Chạy xe thực tế, realtime, thông báo, xử lý ngoại lệ.
- **Release 3 (Quản trị tối ưu):** Phase 9 → 10
  - Kết quả: Báo cáo đầy đủ, ổn định, sẵn sàng mở rộng.

## Đề xuất ưu tiên test theo phase

- Phase 1–2: permission tests, validation tests, config boundary tests.
- Phase 3–5: integration tests cho luồng đăng ký → khóa deadline → optimize → phân chuyến.
- Phase 6–8: end-to-end tests cho runtime (GPS, QR, notify, incident, cancel).
- Phase 9–10: report correctness, load tests, failover tests.

## Ghi chú triển khai nhanh cho team nhỏ

- Nếu team nhỏ, có thể tách 3 lane song song:
  - **Lane A:** Auth + Admin catalog + Config.
  - **Lane B:** Worker booking + Dispatcher import.
  - **Lane C:** Tracking + Notification infrastructure.
- Đến mốc route optimization thì hợp lane để đồng bộ data model.