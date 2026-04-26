# 📘 Bộ Quy Tắc Chung – API Response & Naming Conventions

> Tài liệu này là **chuẩn bắt buộc** cho toàn bộ team khi xây dựng hệ thống Shuttle.  
> Mọi API trả về client, tên hàm, tên biến, mã lỗi đều phải tuân theo bộ quy tắc này.

---

## Mục lục

1. [Cấu trúc Response chuẩn](#1-cấu-trúc-response-chuẩn)
2. [Mã HTTP Status](#2-mã-http-status)
3. [Mã lỗi nội bộ (Error Code)](#3-mã-lỗi-nội-bộ-error-code)
4. [Cấu trúc Pagination](#4-cấu-trúc-pagination)
5. [Quy tắc đặt tên hàm (Function Naming)](#5-quy-tắc-đặt-tên-hàm-function-naming)
6. [Quy tắc đặt tên biến (Variable Naming)](#6-quy-tắc-đặt-tên-biến-variable-naming)
7. [Quy tắc đặt tên API Endpoint](#7-quy-tắc-đặt-tên-api-endpoint)
8. [Role & Permission Naming](#8-role--permission-naming)
9. [Enum & Constant Naming](#9-enum--constant-naming)
10. [Checklist trước khi merge](#10-checklist-trước-khi-merge)

---

## 1. Cấu trúc Response chuẩn

Mọi API trả về client đều phải theo **một trong hai dạng** sau.

### ✅ Thành công (Success)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy danh sách chuyến xe thành công",
  "data": {
    "id": "trip-uuid",
    "status": "ACTIVE"
  }
}
```

### ✅ Thành công dạng danh sách (Paginated List)

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy danh sách thành công",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 135,
    "totalPages": 7
  }
}
```

### ❌ Lỗi (Error)

```json
{
  "success": false,
  "statusCode": 400,
  "errorCode": "BOOKING_DEADLINE_PASSED",
  "message": "Đã qua thời hạn đăng ký lịch cho tuần này",
  "errors": [
    {
      "field": "scheduledDate",
      "message": "Ngày đăng ký phải thuộc tuần kế tiếp"
    }
  ]
}
```

### 📌 Quy tắc bắt buộc

| Field        | Kiểu     | Bắt buộc | Ghi chú                                         |
|--------------|----------|----------|-------------------------------------------------|
| `success`    | boolean  | ✅        | `true` khi thành công, `false` khi lỗi          |
| `statusCode` | number   | ✅        | HTTP status code tương ứng                      |
| `message`    | string   | ✅        | Thông báo dễ đọc, **tiếng Việt** cho người dùng |
| `data`       | any/null | ✅        | `null` nếu không có dữ liệu trả về              |
| `errorCode`  | string   | ❌ (lỗi) | Chỉ xuất hiện khi `success: false`              |
| `errors`     | array    | ❌        | Chi tiết lỗi từng field (validation)            |
| `pagination` | object   | ❌        | Chỉ có khi trả danh sách phân trang             |

---

## 2. Mã HTTP Status

| Status | Ý nghĩa                          | Khi nào dùng                                         |
|--------|----------------------------------|------------------------------------------------------|
| `200`  | OK                               | GET thành công, UPDATE thành công                   |
| `201`  | Created                          | POST tạo mới tài nguyên thành công                  |
| `204`  | No Content                       | DELETE thành công (không trả body)                  |
| `400`  | Bad Request                      | Dữ liệu đầu vào sai, validation fail                |
| `401`  | Unauthorized                     | Chưa đăng nhập / token hết hạn                      |
| `403`  | Forbidden                        | Đã đăng nhập nhưng không có quyền                   |
| `404`  | Not Found                        | Tài nguyên không tồn tại                            |
| `409`  | Conflict                         | Trùng dữ liệu (VD: đã đăng ký ca này rồi)           |
| `422`  | Unprocessable Entity             | Logic nghiệp vụ sai (VD: đã qua deadline)           |
| `429`  | Too Many Requests                | Rate limit bị vượt                                  |
| `500`  | Internal Server Error            | Lỗi hệ thống không xác định                         |

> ⚠️ **Không được** trả `200` khi thực chất có lỗi xảy ra.

---

## 3. Mã lỗi nội bộ (Error Code)

### Quy tắc đặt tên `errorCode`

- Viết **UPPER_SNAKE_CASE**
- Theo cấu trúc: `[DOMAIN]_[MÔ_TẢ_LỖI]`
- Không dùng số, không dùng chữ thường

### Danh sách errorCode theo domain

#### 🔐 Auth

| errorCode                   | HTTP | Mô tả                                 |
|-----------------------------|------|---------------------------------------|
| `AUTH_INVALID_CREDENTIALS`  | 401  | Sai tên đăng nhập hoặc mật khẩu      |
| `AUTH_TOKEN_EXPIRED`        | 401  | Access token đã hết hạn               |
| `AUTH_TOKEN_INVALID`        | 401  | Token không hợp lệ                    |
| `AUTH_REFRESH_TOKEN_INVALID`| 401  | Refresh token không hợp lệ hoặc hết hạn |
| `AUTH_ACCOUNT_LOCKED`       | 403  | Tài khoản bị khóa                     |
| `AUTH_PERMISSION_DENIED`    | 403  | Không có quyền thực hiện hành động này|
| `AUTH_SESSION_EXPIRED`      | 401  | Phiên đăng nhập đã hết hạn            |

#### 👷 Worker / Booking

| errorCode                     | HTTP | Mô tả                                      |
|-------------------------------|------|--------------------------------------------|
| `BOOKING_DEADLINE_PASSED`     | 422  | Đã qua deadline đăng ký lịch tuần này      |
| `BOOKING_ALREADY_EXISTS`      | 409  | Đã đăng ký ca này rồi                      |
| `BOOKING_SHIFT_NOT_AVAILABLE` | 422  | Ca làm không khả dụng trong ngày này       |
| `BOOKING_CANNOT_CANCEL`       | 422  | Không thể hủy đăng ký (đã qua thời hạn)    |
| `BOOKING_WORKER_NOT_FOUND`    | 404  | Không tìm thấy thông tin công nhân         |

#### 🚌 Trip / Dispatch

| errorCode                      | HTTP | Mô tả                                          |
|--------------------------------|------|------------------------------------------------|
| `TRIP_NOT_FOUND`               | 404  | Không tìm thấy chuyến xe                       |
| `TRIP_ALREADY_STARTED`         | 422  | Chuyến xe đã bắt đầu, không thể chỉnh sửa     |
| `TRIP_DRIVER_NOT_ASSIGNED`     | 422  | Chuyến xe chưa được phân tài xế               |
| `TRIP_CAPACITY_EXCEEDED`       | 422  | Xe đã đủ tải, không thể thêm hành khách        |
| `TRIP_CANCEL_TOO_LATE`         | 422  | Hủy chuyến quá muộn (< 30 phút trước giờ chạy)|
| `TRIP_ROUTE_OPTIMIZE_FAILED`   | 500  | Tối ưu hóa lộ trình thất bại                  |

#### 📍 Check-in / QR

| errorCode                    | HTTP | Mô tả                                       |
|------------------------------|------|---------------------------------------------|
| `CHECKIN_OUT_OF_RADIUS`      | 422  | Vị trí check-in nằm ngoài bán kính cho phép |
| `CHECKIN_QR_INVALID`         | 400  | Mã QR không hợp lệ hoặc đã hết hạn          |
| `CHECKIN_ALREADY_DONE`       | 409  | Đã check-in chuyến này rồi                   |
| `CHECKIN_TRIP_NOT_ACTIVE`    | 422  | Chuyến xe chưa hoạt động hoặc đã kết thúc   |

#### 🚗 Driver

| errorCode                   | HTTP | Mô tả                                    |
|-----------------------------|------|------------------------------------------|
| `DRIVER_NOT_FOUND`          | 404  | Không tìm thấy tài xế                    |
| `DRIVER_NOT_CHECKED_IN`     | 422  | Tài xế chưa bắt đầu ca làm               |
| `DRIVER_ALREADY_ON_TRIP`    | 409  | Tài xế đang thực hiện chuyến khác        |
| `DRIVER_INCIDENT_REPORTED`  | 422  | Đang có sự cố chưa được xử lý            |

#### 📁 Dữ liệu chung

| errorCode                   | HTTP | Mô tả                                       |
|-----------------------------|------|---------------------------------------------|
| `VALIDATION_ERROR`          | 400  | Dữ liệu đầu vào không hợp lệ               |
| `RESOURCE_NOT_FOUND`        | 404  | Tài nguyên không tồn tại                   |
| `DUPLICATE_ENTRY`           | 409  | Dữ liệu trùng lặp                           |
| `GEOCODE_FAILED`            | 422  | Không thể chuyển đổi địa chỉ sang tọa độ   |
| `FILE_IMPORT_INVALID`       | 400  | File import sai định dạng hoặc thiếu cột   |
| `INTERNAL_SERVER_ERROR`     | 500  | Lỗi hệ thống không xác định                |

---

## 4. Cấu trúc Pagination

### Request (Query Params)

```
GET /api/v1/trips?page=1&limit=20&sortBy=createdAt&sortOrder=DESC
```

| Param       | Mặc định   | Ghi chú                              |
|-------------|------------|--------------------------------------|
| `page`      | `1`        | Trang hiện tại (bắt đầu từ 1)        |
| `limit`     | `20`       | Số bản ghi mỗi trang (tối đa `100`)  |
| `sortBy`    | `createdAt`| Tên field muốn sắp xếp              |
| `sortOrder` | `DESC`     | `ASC` hoặc `DESC`                    |

### Response

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 135,
    "totalPages": 7,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## 5. Quy tắc đặt tên hàm (Function Naming)

### Cấu trúc: `[động từ][DanhTừ]`

| Động từ    | Dùng khi                                  | Ví dụ                       |
|------------|-------------------------------------------|-----------------------------|
| `get`      | Lấy một bản ghi theo ID                  | `getTrip`, `getDriver`      |
| `list`     | Lấy danh sách (có filter/pagination)      | `listTrips`, `listWorkers`  |
| `create`   | Tạo mới tài nguyên                        | `createBooking`, `createTrip` |
| `update`   | Cập nhật một phần hoặc toàn bộ           | `updateTripStatus`          |
| `delete`   | Xóa cứng                                  | `deleteVehicle`             |
| `cancel`   | Hủy (không xóa, chỉ đổi trạng thái)      | `cancelTrip`, `cancelBooking` |
| `assign`   | Phân công / gán                           | `assignDriver`              |
| `validate` | Kiểm tra tính hợp lệ                      | `validateQrCode`            |
| `calculate`| Tính toán                                 | `calculateRoute`            |
| `send`     | Gửi thông báo / dữ liệu                   | `sendPushNotification`      |
| `import`   | Nhập dữ liệu từ file ngoài                | `importWorkerList`          |
| `export`   | Xuất dữ liệu ra file                      | `exportTripReport`          |
| `check`    | Kiểm tra điều kiện (trả boolean)          | `checkDeadlinePassed`       |
| `lock`     | Khóa tài nguyên                           | `lockWeeklySchedule`        |
| `geocode`  | Chuyển địa chỉ → tọa độ                  | `geocodeAddress`            |

### ✅ Ví dụ đặt tên đúng

```typescript
// Service methods
async getTrip(id: string): Promise<Trip>
async listTrips(filter: ListTripFilter): Promise<PaginatedResult<Trip>>
async createBooking(dto: CreateBookingDto): Promise<Booking>
async cancelTrip(id: string, reason: string): Promise<void>
async assignDriver(tripId: string, driverId: string): Promise<Trip>
async checkDeadlinePassed(weekYear: string): Promise<boolean>
async importWorkerList(file: Express.Multer.File): Promise<ImportResult>
```

### ❌ Ví dụ đặt tên sai

```typescript
// ❌ Không rõ ý định
async handleTrip(...)
async doBooking(...)
async processData(...)

// ❌ Viết tắt khó hiểu
async getTrp(...)
async lstWrk(...)

// ❌ Quá chung chung
async getData(...)
async saveRecord(...)
```

---

## 6. Quy tắc đặt tên biến (Variable Naming)

### Quy tắc chung

- Dùng **camelCase** cho biến và property
- Dùng **PascalCase** cho Class, Interface, Type, Enum
- Dùng **UPPER_SNAKE_CASE** cho hằng số (const global)
- Tên biến phải **mô tả rõ ý nghĩa**, không dùng tên viết tắt một chữ (trừ loop index `i`, `j`)

### ✅ Biến thông thường

```typescript
// ✅ Đúng
const tripId = 'uuid-123';
const driverName = 'Nguyễn Văn A';
const isDeadlinePassed = true;
const totalPassengers = 45;
const scheduledDate = new Date();
const workerList: Worker[] = [];

// ❌ Sai
const d = 'uuid-123';           // quá ngắn
const flag = true;              // không rõ nghĩa
const data = [];                // quá chung chung
const tripdata = {};            // thiếu camelCase
```

### ✅ Boolean – phải bắt đầu bằng `is`, `has`, `can`, `should`

```typescript
const isActive = true;
const hasDriver = false;
const canCancelBooking = true;
const shouldSendNotification = false;
```

### ✅ Array – phải dùng danh từ số nhiều

```typescript
const trips: Trip[] = [];
const driverIds: string[] = [];
const pickupPoints: PickupPoint[] = [];
```

### ✅ Hằng số toàn cục

```typescript
const MAX_PASSENGERS_PER_VEHICLE = 45;
const DEFAULT_CHECKIN_RADIUS_METERS = 100;
const GPS_INTERVAL_SECONDS = 10;
const BOOKING_DEADLINE_DAY = 'FRIDAY';
const CANCEL_ALLOWED_MINUTES_BEFORE = 30;
```

---

## 7. Quy tắc đặt tên API Endpoint

### Cấu trúc chuẩn

```
/api/v{version}/{domain}/{resourceId}/{sub-resource}
```

### Quy tắc

- Dùng **kebab-case** (chữ thường, nối bằng gạch ngang)
- Dùng **danh từ số nhiều** cho resource chính
- **Không** dùng động từ trong URL (dùng HTTP method thay thế)
- Ngoại lệ: action đặc biệt dùng dạng `/resource/:id/action`

### ✅ Ví dụ đúng

```
GET    /api/v1/trips                        → Lấy danh sách chuyến xe
GET    /api/v1/trips/:id                    → Lấy chi tiết một chuyến
POST   /api/v1/trips                        → Tạo chuyến xe mới
PATCH  /api/v1/trips/:id                    → Cập nhật chuyến xe
DELETE /api/v1/trips/:id                    → Xóa chuyến xe

POST   /api/v1/trips/:id/cancel             → Hủy chuyến (action)
POST   /api/v1/trips/:id/assign-driver      → Phân tài xế (action)
POST   /api/v1/trips/:id/check-in           → Check-in chuyến (action)

GET    /api/v1/workers/:id/bookings         → Lịch đăng ký của worker
POST   /api/v1/workers/:id/bookings         → Worker tạo lịch đăng ký

GET    /api/v1/dispatch/weekly-summary      → Tổng hợp nhu cầu theo tuần
POST   /api/v1/dispatch/import-workers      → Import danh sách công nhân
POST   /api/v1/dispatch/optimize-routes     → Chạy tối ưu lộ trình
```

### ❌ Ví dụ sai

```
GET  /api/v1/getTrips           → ❌ có động từ trong URL
POST /api/v1/createBooking      → ❌ có động từ trong URL
POST /api/v1/trip/Cancel        → ❌ PascalCase, thiếu số nhiều
GET  /api/v1/worker_list        → ❌ dùng underscore
```

---

## 8. Role & Permission Naming

### Danh sách Role hệ thống

| Role Enum       | Mô tả                                               |
|-----------------|-----------------------------------------------------|
| `ADMIN`         | Quản trị viên hệ thống, toàn quyền                  |
| `DISPATCHER`    | Điều phối viên: lập tuyến, phân chuyến              |
| `DRIVER`        | Tài xế: vận hành chuyến xe thực tế                  |
| `WORKER`        | Công nhân: đăng ký lịch và theo dõi chuyến xe       |
| `CONTRACTOR`    | Nhà thầu: xem báo cáo công nhân thuộc đơn vị mình  |

### Quy tắc đặt tên Permission

Cấu trúc: `[domain]:[action]`

| Permission                  | Mô tả                                     |
|-----------------------------|-------------------------------------------|
| `trip:read`                 | Xem danh sách và chi tiết chuyến xe       |
| `trip:create`               | Tạo chuyến xe mới                         |
| `trip:update`               | Cập nhật thông tin chuyến xe              |
| `trip:delete`               | Xóa chuyến xe                             |
| `trip:cancel`               | Hủy chuyến xe                             |
| `trip:assign-driver`        | Phân tài xế cho chuyến xe                 |
| `booking:read`              | Xem lịch đăng ký                          |
| `booking:create`            | Tạo đăng ký lịch                          |
| `booking:cancel`            | Hủy đăng ký lịch                          |
| `dispatch:import`           | Import danh sách công nhân                |
| `dispatch:optimize`         | Chạy tối ưu hóa lộ trình                  |
| `dispatch:approve`          | Phê duyệt kế hoạch chuyến xe              |
| `driver:check-in`           | Check-in/check-out ca làm (tài xế)        |
| `driver:report-incident`    | Báo sự cố                                 |
| `worker:check-in`           | Check-in lên xe bằng QR                   |
| `worker:track-vehicle`      | Theo dõi vị trí xe realtime              |
| `report:read`               | Xem báo cáo và dashboard                  |
| `report:export`             | Xuất báo cáo ra file                      |
| `admin:manage-users`        | Quản lý tài khoản người dùng              |
| `admin:manage-config`       | Chỉnh sửa cấu hình hệ thống              |
| `admin:manage-catalog`      | Quản lý danh mục (xe, tài xế, điểm đón)  |

### Ma trận Role – Permission

| Permission               | ADMIN | DISPATCHER | DRIVER | WORKER | CONTRACTOR |
|--------------------------|:-----:|:----------:|:------:|:------:|:----------:|
| `trip:read`              | ✅    | ✅          | ✅     | ✅     | ✅          |
| `trip:create`            | ✅    | ✅          | ❌     | ❌     | ❌          |
| `trip:assign-driver`     | ✅    | ✅          | ❌     | ❌     | ❌          |
| `trip:cancel`            | ✅    | ✅          | ❌     | ❌     | ❌          |
| `booking:create`         | ✅    | ❌          | ❌     | ✅     | ❌          |
| `booking:cancel`         | ✅    | ✅          | ❌     | ✅     | ❌          |
| `dispatch:import`        | ✅    | ✅          | ❌     | ❌     | ❌          |
| `dispatch:optimize`      | ✅    | ✅          | ❌     | ❌     | ❌          |
| `driver:check-in`        | ✅    | ❌          | ✅     | ❌     | ❌          |
| `driver:report-incident` | ✅    | ❌          | ✅     | ❌     | ❌          |
| `worker:check-in`        | ✅    | ❌          | ❌     | ✅     | ❌          |
| `worker:track-vehicle`   | ✅    | ✅          | ❌     | ✅     | ❌          |
| `report:read`            | ✅    | ✅          | ❌     | ❌     | ✅          |
| `report:export`          | ✅    | ✅          | ❌     | ❌     | ✅          |
| `admin:manage-users`     | ✅    | ❌          | ❌     | ❌     | ❌          |
| `admin:manage-config`    | ✅    | ❌          | ❌     | ❌     | ❌          |

---

## 9. Enum & Constant Naming

### Enum (TypeScript)

- Tên Enum dùng **PascalCase**
- Giá trị Enum dùng **UPPER_SNAKE_CASE**

```typescript
// ✅ Trạng thái chuyến xe
enum TripStatus {
  PENDING = 'PENDING',           // Chờ phân tài xế
  SCHEDULED = 'SCHEDULED',       // Đã lên lịch, chưa chạy
  IN_PROGRESS = 'IN_PROGRESS',   // Đang chạy
  COMPLETED = 'COMPLETED',       // Hoàn thành
  CANCELLED = 'CANCELLED',       // Đã hủy
}

// ✅ Trạng thái đăng ký lịch
enum BookingStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  MISSED = 'MISSED',
}

// ✅ Ca làm
enum Shift {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  NIGHT = 'NIGHT',
}

// ✅ Loại sự cố
enum IncidentType {
  VEHICLE_BREAKDOWN = 'VEHICLE_BREAKDOWN',
  TRAFFIC_JAM = 'TRAFFIC_JAM',
  ACCIDENT = 'ACCIDENT',
  OTHER = 'OTHER',
}

// ✅ Trạng thái điểm đón
enum PickupPointStatus {
  PENDING = 'PENDING',
  ARRIVED = 'ARRIVED',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
}

// ✅ Role người dùng
enum UserRole {
  ADMIN = 'ADMIN',
  DISPATCHER = 'DISPATCHER',
  DRIVER = 'DRIVER',
  WORKER = 'WORKER',
  CONTRACTOR = 'CONTRACTOR',
}
```

---

## 10. Checklist trước khi merge

Trước khi tạo Pull Request, developer phải tự kiểm tra toàn bộ checklist sau:

### 📦 Response

- [ ] Mọi API trả về đúng cấu trúc `{ success, statusCode, message, data }`
- [ ] Không trả `200` khi có lỗi
- [ ] `message` viết tiếng Việt, dễ hiểu với người dùng cuối
- [ ] Lỗi validation có field `errors[]` chi tiết
- [ ] Danh sách có `pagination` object đầy đủ

### 🔑 Error Code

- [ ] Dùng đúng `errorCode` từ danh sách đã định nghĩa
- [ ] Nếu cần thêm `errorCode` mới → cập nhật tài liệu này trước
- [ ] HTTP status khớp với `errorCode` được dùng

### ✍️ Naming

- [ ] Tên hàm bắt đầu bằng động từ đúng quy ước (`get`, `list`, `create`, ...)
- [ ] Biến boolean bắt đầu bằng `is`, `has`, `can`, `should`
- [ ] Mảng dùng danh từ số nhiều
- [ ] Không có tên biến một chữ (ngoài loop index)
- [ ] Endpoint dùng kebab-case, danh từ số nhiều, không có động từ trong URL

### 🔐 Role & Permission

- [ ] Endpoint có `@Roles()` hoặc `@Permissions()` decorator đúng
- [ ] Không có endpoint nào bị bỏ quên guard
- [ ] Permission dùng đúng format `domain:action`

### 🧪 Test

- [ ] Có unit test cho service method mới
- [ ] Có test case cho cả trường hợp thành công lẫn lỗi
- [ ] Không có `console.log` thừa trong code

---

> 📌 **Tài liệu này cần được cập nhật** mỗi khi team thống nhất thêm convention mới.  
> Người cập nhật cần thông báo trong channel team và ghi rõ ngày thay đổi ở đây.

| Phiên bản | Ngày cập nhật | Người cập nhật | Thay đổi              |
|-----------|---------------|----------------|-----------------------|
| v1.0      | 2025-04-25    | Team Shuttle   | Khởi tạo tài liệu     |
