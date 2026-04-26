# Database Design — Hệ thống Điều phối Xe Đưa Đón

> Stack: **NestJS + TypeORM + PostgreSQL**
> Quy ước đặt tên: `snake_case` cho tên bảng và cột, `PascalCase` cho Entity class.

---

## Tổng quan các Entity (14 bảng)

| # | Entity | Bảng | Mô tả |
|---|---|---|---|
| 1 | User | `users` | Tài khoản chung cho tất cả actors |
| 2 | Worker | `workers` | Thông tin bổ sung của công nhân |
| 3 | Driver | `drivers` | Thông tin bổ sung của tài xế |
| 4 | Vehicle | `vehicles` | Danh sách xe (bao gồm thông tin nhà thầu) |
| 5 | Shift | `shifts` | Ca làm việc (sáng / chiều / hành chính) |
| 6 | WeeklyRegistration | `weekly_registrations` | Đăng ký đưa đón hàng tuần của worker |
| 7 | Trip | `trips` | Chuyến xe + log check-in/out tài xế |
| 8 | TripStop | `trip_stops` | Điểm đón theo thứ tự trong một chuyến |
| 9 | TripWorker | `trip_workers` | Worker được phân vào chuyến + trạng thái check-in |
| 10 | GpsLocation | `gps_locations` | Vị trí GPS realtime của xe |
| 11 | Incident | `incidents` | Báo cáo sự cố từ tài xế |
| 12 | FuelReport | `fuel_reports` | Báo cáo nhiên liệu của tài xế |
| 13 | Notification | `notifications` | Lịch sử thông báo gửi đến user |
| 14 | SystemConfig | `system_configs` | Cấu hình hệ thống do Admin quản lý |

> **Quyết định gộp:**
> - `driver_shift_logs` → gộp vào `trips` (thêm cột `driver_checkin_at`, `driver_checkout_at` và tọa độ tương ứng) vì 1 trip chỉ có đúng 1 tài xế, tạo bảng riêng thừa.
> - `contractors` → không tạo bảng riêng, lưu `contractor_name` + `contractor_phone` trực tiếp trong `vehicles`.

---

## Chi tiết từng Entity

---

### 1. `users` — Tài khoản hệ thống

Dùng chung cho tất cả actors. Role phân biệt quyền hạn.

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  manv: string;

  @Column()
  password_hash: string;                  // bcrypt

  @Column()
  full_name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'dispatcher', 'driver', 'worker'],
  })
  role: 'admin' | 'dispatcher' | 'driver' | 'worker';

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  fcm_token: string;                      // Firebase Cloud Messaging — push notification

  @Column({ nullable: true })
  last_login_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToOne(() => Worker, (w) => w.user)
  worker: Worker;

  @OneToOne(() => Driver, (d) => d.user)
  driver: Driver;
}
```

**Indexes:** `email` (unique), `role`, `is_active`

---

### 2. `workers` — Thông tin công nhân

```typescript
@Entity('workers')
export class Worker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true })
  user_id: string;

  @Column({ unique: true })
  employee_code: string;                  // Mã công nhân nội bộ

  @Column({ nullable: true })
  department: string;                     // Phân xưởng / bộ phận

  @Column('text')
  pickup_address: string;                 // Địa chỉ đón mặc định

  @Column('decimal', { precision: 10, scale: 7 })
  pickup_lat: number;

  @Column('decimal', { precision: 10, scale: 7 })
  pickup_lng: number;

  @ManyToOne(() => Shift, { nullable: true })
  @JoinColumn({ name: 'default_shift_id' })
  default_shift: Shift;

  @Column({ nullable: true })
  default_shift_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

**Indexes:** `user_id` (unique), `employee_code` (unique), `default_shift_id`

---

### 3. `drivers` — Thông tin tài xế

```typescript
@Entity('drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true })
  user_id: string;

  @Column({ unique: true })
  license_number: string;                 // Số bằng lái

  @Column({ nullable: true })
  license_expires_at: Date;

  @ManyToOne(() => Vehicle, { nullable: true })
  @JoinColumn({ name: 'default_vehicle_id' })
  default_vehicle: Vehicle;              // Xe được gán mặc định

  @Column({ nullable: true })
  default_vehicle_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

**Indexes:** `user_id` (unique), `license_number` (unique)

---

### 4. `vehicles` — Danh sách xe

> Thông tin nhà thầu lưu trực tiếp ở đây, không tạo bảng `contractors` riêng.

```typescript
@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  plate_number: string;                   // Biển số xe

  @Column()
  vehicle_type: string;                   // VD: "16 chỗ", "29 chỗ"

  @Column('int')
  capacity: number;                       // Sức chứa (số ghế)

  // Thông tin nhà thầu (gộp vào đây thay vì bảng riêng)
  @Column({ nullable: true })
  contractor_name: string;

  @Column({ nullable: true })
  contractor_phone: string;

  @Column({
    type: 'enum',
    enum: ['available', 'in_use', 'maintenance', 'retired'],
    default: 'available',
  })
  status: 'available' | 'in_use' | 'maintenance' | 'retired';

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

**Indexes:** `plate_number` (unique), `status`

---

### 5. `shifts` — Ca làm việc

```typescript
@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;                           // VD: "Ca sáng", "Ca chiều", "Ca hành chính"

  @Column({ type: 'time' })
  start_time: string;                     // Giờ bắt đầu ca (HH:mm)

  @Column({ type: 'time' })
  factory_arrival_deadline: string;       // Giờ tối đa công nhân phải có mặt tại nhà máy

  @Column({ default: true })
  is_active: boolean;
}
```

---

### 6. `weekly_registrations` — Đăng ký đưa đón hàng tuần

Mỗi record = 1 công nhân đăng ký đi/về cho 1 ngày cụ thể.

```typescript
@Entity('weekly_registrations')
export class WeeklyRegistration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Worker)
  @JoinColumn({ name: 'worker_id' })
  worker: Worker;

  @Column()
  worker_id: string;

  @ManyToOne(() => Shift)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @Column()
  shift_id: string;

  @Column({ type: 'date' })
  trip_date: string;                      // Ngày cụ thể (YYYY-MM-DD)

  @Column({
    type: 'enum',
    enum: ['to_factory', 'from_factory', 'both'],
  })
  direction: 'to_factory' | 'from_factory' | 'both';

  @Column({
    type: 'enum',
    enum: ['registered', 'cancelled', 'missed'],
    default: 'registered',
  })
  status: 'registered' | 'cancelled' | 'missed';

  @Column({ nullable: true })
  cancel_reason: string;                  // "nghi_phep" | "doi_ca" | "khac"

  @Column({ nullable: true })
  cancelled_at: Date;

  @Column({ type: 'int' })
  iso_week: number;                       // Tuần ISO (1–53) để group theo tuần

  @Column({ type: 'int' })
  iso_year: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

**Indexes:** `(worker_id, trip_date, shift_id)` (unique composite), `(iso_year, iso_week)`, `status`

---

### 7. `trips` — Chuyến xe

Mỗi record = 1 xe chạy 1 lộ trình trong 1 ca, 1 ngày.
**Gộp log check-in/out tài xế vào đây** (thay thế bảng `driver_shift_logs`).

```typescript
@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column()
  vehicle_id: string;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column()
  driver_id: string;

  @ManyToOne(() => Shift)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @Column()
  shift_id: string;

  @Column({ type: 'date' })
  trip_date: string;                      // Ngày chạy (YYYY-MM-DD)

  @Column({
    type: 'enum',
    enum: ['to_factory', 'from_factory'],
  })
  direction: 'to_factory' | 'from_factory';

  @Column({
    type: 'enum',
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'incident'],
    default: 'scheduled',
  })
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'incident';

  @Column({ nullable: true })
  estimated_arrival_at: Date;             // Giờ dự kiến đến nhà máy (từ Route Optimization)

  @Column({ nullable: true })
  actual_start_at: Date;                  // Xe thực sự xuất phát

  @Column({ nullable: true })
  actual_end_at: Date;                    // Xe thực sự kết thúc

  @Column('decimal', { precision: 8, scale: 3, nullable: true })
  total_distance_km: number;

  @Column({ nullable: true, unique: true })
  qr_code: string;                        // UUID dùng để tạo QR check-in

  // ── Gộp từ driver_shift_logs ──────────────────────────────
  @Column({ nullable: true })
  driver_checkin_at: Date;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  driver_checkin_lat: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  driver_checkin_lng: number;

  @Column({ nullable: true })
  driver_checkout_at: Date;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  driver_checkout_lat: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  driver_checkout_lng: number;
  // ──────────────────────────────────────────────────────────

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relations
  @OneToMany(() => TripStop, (s) => s.trip)
  stops: TripStop[];

  @OneToMany(() => TripWorker, (tw) => tw.trip)
  trip_workers: TripWorker[];
}
```

**Indexes:** `(vehicle_id, trip_date, shift_id)`, `(driver_id, trip_date)`, `status`, `trip_date`, `qr_code` (unique)

---

### 8. `trip_stops` — Điểm đón trong chuyến

Mỗi record = 1 điểm dừng trong lộ trình, theo thứ tự tối ưu.

```typescript
@Entity('trip_stops')
export class TripStop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Trip, (t) => t.stops)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column()
  trip_id: string;

  @Column('int')
  stop_order: number;                     // Thứ tự điểm đón (1, 2, 3...)

  @Column('text')
  address: string;

  @Column('decimal', { precision: 10, scale: 7 })
  lat: number;

  @Column('decimal', { precision: 10, scale: 7 })
  lng: number;

  @Column({ nullable: true })
  estimated_arrival_at: Date;             // ETA đến điểm này

  @Column({ nullable: true })
  actual_arrival_at: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'arrived', 'completed', 'skipped'],
    default: 'pending',
  })
  status: 'pending' | 'arrived' | 'completed' | 'skipped';

  @Column('int', { default: 0 })
  expected_worker_count: number;          // Số công nhân dự kiến đón tại điểm này
}
```

**Indexes:** `(trip_id, stop_order)` (unique composite)

---

### 9. `trip_workers` — Công nhân trong chuyến

Bảng join giữa Trip và Worker, lưu trạng thái check-in.

```typescript
@Entity('trip_workers')
export class TripWorker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Trip, (t) => t.trip_workers)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column()
  trip_id: string;

  @ManyToOne(() => Worker)
  @JoinColumn({ name: 'worker_id' })
  worker: Worker;

  @Column()
  worker_id: string;

  @ManyToOne(() => TripStop, { nullable: true })
  @JoinColumn({ name: 'assigned_stop_id' })
  assigned_stop: TripStop;

  @Column({ nullable: true })
  assigned_stop_id: string;

  @Column({
    type: 'enum',
    enum: ['assigned', 'checked_in', 'missed', 'cancelled'],
    default: 'assigned',
  })
  status: 'assigned' | 'checked_in' | 'missed' | 'cancelled';

  @Column({ nullable: true })
  checked_in_at: Date;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  checkin_lat: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  checkin_lng: number;

  @Column({ nullable: true })
  missed_reported_at: Date;
}
```

**Indexes:** `(trip_id, worker_id)` (unique composite), `status`, `worker_id`

---

### 10. `gps_locations` — Vị trí GPS realtime

> ⚠️ Ghi mỗi 5 giây — volume rất lớn. Dùng Redis buffer, batch insert mỗi 30 giây. Cân nhắc **TimescaleDB** hoặc partition theo `recorded_at`.

```typescript
@Entity('gps_locations')
export class GpsLocation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column()
  trip_id: string;

  @Column('decimal', { precision: 10, scale: 7 })
  lat: number;

  @Column('decimal', { precision: 10, scale: 7 })
  lng: number;

  @Column('decimal', { precision: 5, scale: 1, nullable: true })
  speed_kmh: number;

  @Column()
  recorded_at: Date;                      // Thời điểm ghi vị trí (từ thiết bị)

  @CreateDateColumn()
  created_at: Date;
}
```

**Indexes:** `(trip_id, recorded_at)`, `recorded_at`
> Khuyến nghị: xóa hoặc archive dữ liệu cũ hơn 90 ngày bằng cron job.

---

### 11. `incidents` — Báo cáo sự cố

```typescript
@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column()
  trip_id: string;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'reported_by_driver_id' })
  reported_by: Driver;

  @Column()
  reported_by_driver_id: string;

  @Column({
    type: 'enum',
    enum: ['vehicle_breakdown', 'traffic_jam', 'accident', 'other'],
  })
  type: 'vehicle_breakdown' | 'traffic_jam' | 'accident' | 'other';

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  incident_lat: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  incident_lng: number;

  @Column({
    type: 'enum',
    enum: ['open', 'in_progress', 'resolved'],
    default: 'open',
  })
  resolution_status: 'open' | 'in_progress' | 'resolved';

  @Column('text', { nullable: true })
  resolution_note: string;               // Ghi chú xử lý của Dispatcher

  @Column()
  reported_at: Date;

  @Column({ nullable: true })
  resolved_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
```

**Indexes:** `trip_id`, `resolution_status`, `reported_at`

---

### 12. `fuel_reports` — Báo cáo nhiên liệu

```typescript
@Entity('fuel_reports')
export class FuelReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @Column()
  driver_id: string;

  @ManyToOne(() => Trip)
  @JoinColumn({ name: 'trip_id' })
  trip: Trip;

  @Column()
  trip_id: string;

  @ManyToOne(() => Vehicle)
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: Vehicle;

  @Column()
  vehicle_id: string;

  @Column('decimal', { precision: 5, scale: 1 })
  fuel_level_percent: number;            // Mức xăng hiện tại (%)

  @Column('decimal', { precision: 10, scale: 0, nullable: true })
  fuel_cost_vnd: number;                 // Số tiền đổ xăng (VND)

  @Column('decimal', { precision: 5, scale: 1, nullable: true })
  fuel_liters: number;

  @Column({ nullable: true })
  receipt_image_url: string;             // Ảnh hóa đơn (S3 / Cloudinary)

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;
}
```

**Indexes:** `driver_id`, `vehicle_id`, `trip_id`

---

### 13. `notifications` — Lịch sử thông báo

```typescript
@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @Column({
    type: 'enum',
    enum: [
      'vehicle_approaching',
      'vehicle_arrived',
      'vehicle_departed',
      'trip_cancelled',
      'trip_updated',
      'incident_alert',
      'booking_reminder',
    ],
  })
  type: string;

  @Column()
  title: string;

  @Column('text')
  body: string;

  @Column('jsonb', { nullable: true })
  payload: Record<string, any>;          // Dữ liệu phụ: trip_id, stop_id...

  @Column({ default: false })
  is_read: boolean;

  @Column({ nullable: true })
  read_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
```

**Indexes:** `(user_id, is_read)`, `(user_id, created_at)`, `type`

---

### 14. `system_configs` — Cấu hình hệ thống

Key-value store cho Admin cấu hình runtime mà không cần deploy lại.

```typescript
@Entity('system_configs')
export class SystemConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column('text')
  value: string;

  @Column({ nullable: true })
  description: string;

  @UpdateDateColumn()
  updated_at: Date;
}
```

**Các key mặc định:**

| key | value mặc định | Mô tả |
|---|---|---|
| `registration_deadline_weekday` | `2` | Thứ mấy là deadline (0=CN, 2=Thứ 3) |
| `cancel_min_minutes_before` | `60` | Phút tối thiểu trước khi xe chạy để được hủy |
| `checkin_radius_meters` | `200` | Bán kính hợp lệ để check-in QR |
| `gps_interval_seconds` | `5` | Tần suất gửi GPS |
| `notification_distance_meters` | `2000` | Khoảng cách kích hoạt thông báo xe đến gần |
| `gps_retention_days` | `90` | Số ngày giữ dữ liệu GPS trước khi xóa |

---

## Quan hệ giữa các Entity (ERD tóm tắt)

```
users ──1:1──► workers ──N:1──► shifts
     └──1:1──► drivers ──N:1──► vehicles (default_vehicle)

vehicles (có contractor_name, contractor_phone)

trips ──N:1──► vehicles
      ──N:1──► drivers
      ──N:1──► shifts
      ──1:N──► trip_stops
      ──1:N──► trip_workers ──N:1──► workers
                             └──N:1──► trip_stops
      ──1:N──► gps_locations
      ──1:N──► incidents
      ──1:N──► fuel_reports

weekly_registrations ──N:1──► workers
                     ──N:1──► shifts

notifications ──N:1──► users
system_configs (standalone)
```

---

## Lưu ý kỹ thuật

### Realtime GPS
- Không ghi GPS vào PostgreSQL theo từng request — dùng **Redis** để cache vị trí mới nhất (`trip:{trip_id}:location`), batch insert vào `gps_locations` mỗi 30 giây.
- Dùng **WebSocket (Socket.IO)** qua NestJS Gateway để push vị trí cho Dispatcher và Worker đang xem bản đồ.

### QR Code Check-in
- `trips.qr_code` là UUID ngẫu nhiên sinh khi tạo chuyến, encode thành QR ở frontend.
- Khi Worker quét QR → `POST /trips/check-in` → server validate: đúng trip, worker thuộc chuyến, trong bán kính `checkin_radius_meters`.

### Route Optimization
- Kết quả VRP cache tạm trong Redis, chỉ lưu vào `trip_stops` sau khi Dispatcher xác nhận.

### Soft Delete
- Các bảng `users`, `vehicles`, `drivers`, `workers` dùng `is_active: false` thay vì xóa cứng để giữ tham chiếu lịch sử.

### Migrations
- Dùng TypeORM Migration (`typeorm migration:generate`, `migration:run`) — **không dùng `synchronize: true`** trên production.
