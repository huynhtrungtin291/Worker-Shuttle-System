# Mục đích hệ thống

## Tổng quan

Hệ thống điều phối xe đưa đón công nhân thông minh, phục vụ các nhà máy/khu công nghiệp có nhiều ca làm việc. Mục tiêu là tối ưu lộ trình, tự động phân công tài xế, theo dõi xe theo thời gian thực, và quản lý chuyến đi theo ca làm việc — giảm thiểu chi phí vận hành và đảm bảo công nhân đến nơi đúng giờ.

## Đối tượng sử dụng

- **Công nhân (Worker):** Người được đưa đón từ điểm nhà/điểm tập kết đến nhà máy theo ca.
- **Tài xế (Driver):** Người lái xe thực hiện lộ trình được phân công.
- **Điều phối viên (Dispatcher):** Người lập kế hoạch, phân công xe và xử lý tình huống phát sinh.
- **Quản trị viên (Admin):** Người quản lý toàn bộ hệ thống, dữ liệu và báo cáo.

## Bài toán cốt lõi

- **Tối ưu lộ trình VRP (Vehicle Routing Problem):** Phân tuyến đường cho nhiều xe, nhiều điểm đón, theo ràng buộc ca sáng / chiều / hành chính.
- **Tự động phân công:** Ghép công nhân vào xe và tài xế dựa trên vị trí địa lý, sức chứa xe, và thời gian yêu cầu.
- **Theo dõi thời gian thực:** Cập nhật vị trí xe liên tục, thông báo cho công nhân khi xe đến gần.
- **Quản lý chuyến động:** Xử lý hủy chuyến, vắng mặt, sự cố xe, và điều phối lại lộ trình khi cần.
- **Báo cáo KPI:** Đúng giờ, km tiêu thụ, tỷ lệ lấp đầy xe, chi phí vận hành.

## Phạm vi hệ thống

- Hỗ trợ nhiều ca làm việc trong ngày (sáng, chiều, hành chính).
- Quản lý đăng ký đưa đón theo tuần (deadline thứ 3 hàng tuần cho tuần tiếp theo).
- Tích hợp Google Maps để dẫn đường cho tài xế.
- Hỗ trợ check-in bằng QR code trên xe.
- Import danh sách công nhân và địa chỉ từ file Excel.
