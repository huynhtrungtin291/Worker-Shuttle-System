# Worker Shuttle System - Sample Test Data

This document contains sample data for testing all API endpoints.

---

## 1. Authentication Endpoints Test Data

### 1.1 Login Request

**Endpoint:** `POST /auth/login`

```json
{
  "username": "admin_user",
  "password": "Admin@12345"
}
```

**Sample Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin_user",
    "fullname": "Nguyễn Văn Admin",
    "phone": "0912345678",
    "role": "admin",
    "is_active": true,
    "last_login_at": "2024-05-01T10:30:00Z"
  }
}
```

### 1.2 Refresh Token Request

**Endpoint:** `POST /auth/refresh`

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Sample Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 1.3 Logout Request

**Endpoint:** `POST /auth/logout`

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Sample Response:**

```json
{
  "message": "Logout successful"
}
```

---

## 2. Users Management Test Data

### 2.1 Create Admin User

**Endpoint:** `POST /users`

**Headers:**

```
Authorization: Bearer {adminAccessToken}
```

**Request:**

```json
{
  "username": "new_admin",
  "password": "SecurePass@2024",
  "fullname": "Trần Văn Admin Mới",
  "phone": "0987654321",
  "role": "admin",
  "is_active": true,
  "fcm_token": "eH0zDQ8DpnI:APA91bF..._optional"
}
```

**Sample Response:**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "username": "new_admin",
  "fullname": "Trần Văn Admin Mới",
  "phone": "0987654321",
  "role": "admin",
  "is_active": true,
  "created_at": "2024-05-01T10:35:00Z"
}
```

### 2.2 Create Dispatcher User

**Endpoint:** `POST /users`

**Request:**

```json
{
  "username": "dispatcher_001",
  "password": "Dispatcher@123",
  "fullname": "Lê Thị Phân Công",
  "phone": "0901234567",
  "role": "dispatcher",
  "is_active": true
}
```

**Sample Response:**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "username": "dispatcher_001",
  "fullname": "Lê Thị Phân Công",
  "phone": "0901234567",
  "role": "dispatcher",
  "is_active": true,
  "created_at": "2024-05-01T10:36:00Z"
}
```

### 2.3 Set Account Status

**Endpoint:** `POST /users/set-account-status`

**Request:**

```json
{
  "username": "new_admin",
  "is_active": false
}
```

**Sample Response:**

```json
{
  "message": "Account status updated",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "username": "new_admin",
    "is_active": false
  }
}
```

---

## 3. Drivers Management Test Data

### 3.1 Create Driver with User Account

**Endpoint:** `POST /drivers/create-with-user`

**Request:**

```json
{
  "createUserDto": {
    "username": "driver_001",
    "password": "Driver@Pass123",
    "fullname": "Phạm Minh Tài",
    "phone": "0923456789",
    "role": "driver",
    "is_active": true,
    "fcm_token": "eH0zDQ8DpnI:APA91bF..."
  },
  "createDriverDto": {
    "user_id": "507f1f77bcf86cd799439020",
    "license_number": "DL123456789",
    "license_expires_at": "2026-12-31T23:59:59Z"
  }
}
```

**Sample Response:**

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439020",
    "username": "driver_001",
    "fullname": "Phạm Minh Tài",
    "phone": "0923456789",
    "role": "driver"
  },
  "driver": {
    "_id": "507f1f77bcf86cd799439021",
    "user_id": "507f1f77bcf86cd799439020",
    "license_number": "DL123456789",
    "license_expires_at": "2026-12-31T23:59:59Z"
  }
}
```

### 3.2 Create Another Driver

**Endpoint:** `POST /drivers/create-with-user`

**Request:**

```json
{
  "createUserDto": {
    "username": "driver_002",
    "password": "Driver@Pass456",
    "fullname": "Vũ Đức Hùng",
    "phone": "0934567890",
    "role": "driver",
    "is_active": true
  },
  "createDriverDto": {
    "user_id": "507f1f77bcf86cd799439022",
    "license_number": "DL987654321",
    "license_expires_at": "2026-08-15T23:59:59Z"
  }
}
```

---

## 4. Workers Management Test Data

### 4.1 Create Worker with User Account

**Endpoint:** `POST /workers`

**Request:**

```json
{
  "createUserDto": {
    "username": "worker_001",
    "password": "Worker@Pass789",
    "fullname": "Đỗ Quốc Huy",
    "phone": "0945678901",
    "role": "worker",
    "is_active": true,
    "fcm_token": "eH0zDQ8DpnI:APA91bF..."
  },
  "createWorkerDto": {
    "employee_code": "EMP2024001",
    "department": "Assembly Line A",
    "pickup_address": "145 Nguyễn Hữu Cảnh, Quận 1, TP.HCM",
    "pickup_lat": 10.7769,
    "pickup_lng": 106.7009,
    "default_shift_id": "507f1f77bcf86cd799439050"
  }
}
```

**Sample Response:**

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439030",
    "username": "worker_001",
    "fullname": "Đỗ Quốc Huy",
    "phone": "0945678901",
    "role": "worker"
  },
  "worker": {
    "_id": "507f1f77bcf86cd799439031",
    "user_id": "507f1f77bcf86cd799439030",
    "employee_code": "EMP2024001",
    "department": "Assembly Line A",
    "pickup_address": "145 Nguyễn Hữu Cảnh, Quận 1, TP.HCM",
    "pickup_lat": 10.7769,
    "pickup_lng": 106.7009,
    "default_shift_id": "507f1f77bcf86cd799439050"
  }
}
```

### 4.2 Create Another Worker

**Endpoint:** `POST /workers`

**Request:**

```json
{
  "createUserDto": {
    "username": "worker_002",
    "password": "Worker@Pass456",
    "fullname": "Bùi Thị Thanh Hương",
    "phone": "0956789012",
    "role": "worker",
    "is_active": true
  },
  "createWorkerDto": {
    "employee_code": "EMP2024002",
    "department": "Packaging",
    "pickup_address": "89 Lê Lợi, Quận 1, TP.HCM",
    "pickup_lat": 10.7809,
    "pickup_lng": 106.6953,
    "default_shift_id": "507f1f77bcf86cd799439051"
  }
}
```

### 4.3 Create Worker without Default Shift

**Endpoint:** `POST /workers`

**Request:**

```json
{
  "createUserDto": {
    "username": "worker_003",
    "password": "Worker@Pass123",
    "fullname": "Hoàng Văn Sơn",
    "phone": "0967890123",
    "role": "worker",
    "is_active": true
  },
  "createWorkerDto": {
    "employee_code": "EMP2024003",
    "department": "Quality Control",
    "pickup_address": "200 Võ Văn Kiệt, Quận 5, TP.HCM",
    "pickup_lat": 10.7487,
    "pickup_lng": 106.6869
  }
}
```

---

## 5. Vehicles Management Test Data

### 5.1 Create Bus Vehicle

**Endpoint:** `POST /vehicles`

**Request:**

```json
{
  "plate_number": "BUS-01-HCMC",
  "vehicle_type": "Bus",
  "capacity": 45,
  "contractor_name": "Transport Company ABC",
  "contractor_phone": "0888888888",
  "status": "available",
  "notes": "New bus, recently serviced"
}
```

**Sample Response:**

```json
{
  "_id": "507f1f77bcf86cd799439040",
  "plate_number": "BUS-01-HCMC",
  "vehicle_type": "Bus",
  "capacity": 45,
  "contractor_name": "Transport Company ABC",
  "contractor_phone": "0888888888",
  "status": "available",
  "notes": "New bus, recently serviced",
  "created_at": "2024-05-01T11:00:00Z"
}
```

### 5.2 Create Another Bus

**Endpoint:** `POST /vehicles`

**Request:**

```json
{
  "plate_number": "BUS-02-HCMC",
  "vehicle_type": "Bus",
  "capacity": 40,
  "contractor_name": "Transport Company ABC",
  "contractor_phone": "0888888888",
  "status": "available",
  "notes": "Standard capacity bus"
}
```

### 5.3 Create Van Vehicle

**Endpoint:** `POST /vehicles`

**Request:**

```json
{
  "plate_number": "VAN-01-HCMC",
  "vehicle_type": "Van",
  "capacity": 16,
  "contractor_name": "Quick Transport",
  "contractor_phone": "0777777777",
  "status": "available",
  "notes": "Emergency backup vehicle"
}
```

### 5.4 Create Vehicle in Maintenance

**Endpoint:** `POST /vehicles`

**Request:**

```json
{
  "plate_number": "BUS-03-HCMC",
  "vehicle_type": "Bus",
  "capacity": 45,
  "contractor_name": "Transport Company ABC",
  "contractor_phone": "0888888888",
  "status": "maintenance",
  "notes": "Engine maintenance - will be ready by May 15"
}
```

---

## 6. Shifts Management Test Data

### 6.1 Create Morning Shift

**Endpoint:** `POST /shifts`

**Request:**

```json
{
  "name": "Morning Shift",
  "start_time": "06:00",
  "factory_arrival_deadline": "07:30",
  "is_active": true
}
```

**Sample Response:**

```json
{
  "_id": "507f1f77bcf86cd799439050",
  "name": "Morning Shift",
  "start_time": "06:00",
  "factory_arrival_deadline": "07:30",
  "is_active": true,
  "created_at": "2024-05-01T11:05:00Z"
}
```

### 6.2 Create Afternoon Shift

**Endpoint:** `POST /shifts`

**Request:**

```json
{
  "name": "Afternoon Shift",
  "start_time": "13:00",
  "factory_arrival_deadline": "14:30",
  "is_active": true
}
```

### 6.3 Create Night Shift

**Endpoint:** `POST /shifts`

**Request:**

```json
{
  "name": "Night Shift",
  "start_time": "21:00",
  "factory_arrival_deadline": "22:30",
  "is_active": true
}
```

### 6.4 Create Inactive Shift

**Endpoint:** `POST /shifts`

**Request:**

```json
{
  "name": "Weekend Special",
  "start_time": "08:00",
  "factory_arrival_deadline": "09:30",
  "is_active": false
}
```

---

## 7. Weekly Registrations Test Data

### 7.1 Create Registration for Tomorrow

**Endpoint:** `POST /weekly-registrations`

**Headers:**

```
Authorization: Bearer {workerAccessToken}
```

**Request:**

```json
{
  "worker_id": "507f1f77bcf86cd799439031",
  "shift_id": "507f1f77bcf86cd799439050",
  "trip_date": "2024-05-02",
  "status": "registered",
  "iso_week": 18,
  "iso_year": 2024
}
```

**Sample Response:**

```json
{
  "_id": "507f1f77bcf86cd799439060",
  "worker_id": "507f1f77bcf86cd799439031",
  "shift_id": "507f1f77bcf86cd799439050",
  "trip_date": "2024-05-02",
  "status": "registered",
  "iso_week": 18,
  "iso_year": 2024,
  "created_at": "2024-05-01T11:10:00Z"
}
```

### 7.2 Cancel Registration

**Endpoint:** `POST /weekly-registrations`

**Request:**

```json
{
  "worker_id": "507f1f77bcf86cd799439031",
  "shift_id": "507f1f77bcf86cd799439051",
  "trip_date": "2024-05-03",
  "status": "cancelled",
  "cancel_reason": "Personal emergency",
  "iso_week": 18,
  "iso_year": 2024
}
```

### 7.3 Register for Next Week

**Endpoint:** `POST /weekly-registrations`

**Request:**

```json
{
  "worker_id": "507f1f77bcf86cd799439031",
  "shift_id": "507f1f77bcf86cd799439050",
  "trip_date": "2024-05-06",
  "status": "registered",
  "iso_week": 19,
  "iso_year": 2024
}
```

### 7.4 Register Multiple Days

**Endpoint:** `POST /weekly-registrations`

**Request (Day 1):**

```json
{
  "worker_id": "507f1f77bcf86cd799439031",
  "shift_id": "507f1f77bcf86cd799439050",
  "trip_date": "2024-05-07",
  "status": "registered"
}
```

**Request (Day 2):**

```json
{
  "worker_id": "507f1f77bcf86cd799439031",
  "shift_id": "507f1f77bcf86cd799439051",
  "trip_date": "2024-05-08",
  "status": "registered"
}
```

---

## 8. Health Check Test Data

### 8.1 Get Hello Message

**Endpoint:** `GET /`

**Sample Response:**

```
Hello World!
```

---

## Testing Workflow

### Recommended Testing Order

1. **Health Check**
   - Call `GET /` to verify server is running

2. **Authentication**
   - Create an admin user using `POST /users`
   - Login with credentials using `POST /auth/login`
   - Keep access token for subsequent requests

3. **Setup Master Data (Admin Only)**
   - Create shifts using `POST /shifts`
   - Create vehicles using `POST /vehicles`

4. **Create Users**
   - Create driver using `POST /drivers/create-with-user`
   - Create workers using `POST /workers`

5. **Worker Activities (Worker Role)**
   - Login as worker
   - Register for shifts using `POST /weekly-registrations`
   - Create multiple registrations for the week

6. **Admin Management**
   - Set account status using `POST /users/set-account-status`
   - Refresh tokens using `POST /auth/refresh`
   - Logout using `POST /auth/logout`

---

## Coordinate Reference Points (Ho Chi Minh City)

For testing pickup locations:

| Location          | Latitude | Longitude | Notes                   |
| ----------------- | -------- | --------- | ----------------------- |
| District 1 Center | 10.7769  | 106.7009  | Central business area   |
| District 5        | 10.7487  | 106.6869  | Southern area           |
| District 7        | 10.8000  | 106.7600  | Hi-tech industrial zone |
| District 4        | 10.7700  | 106.7500  | Eastern area            |
| Tan Binh District | 10.8200  | 106.6800  | Western industrial area |

---

## Common Test Cases

### Test Case 1: Complete User Flow

1. Create admin user
2. Login as admin
3. Create worker
4. Logout as admin
5. Login as worker
6. Register for shifts
7. Logout as worker

### Test Case 2: Vehicle Management

1. Login as admin
2. Create multiple vehicles
3. Set vehicle status to "maintenance"
4. Verify vehicle creation

### Test Case 3: Shift Management

1. Login as admin
2. Create shifts for each time slot
3. Verify shift times follow HH:mm format
4. Create registrations using those shifts

### Test Case 4: Error Handling

1. Login with wrong credentials (expect 401)
2. Create user with invalid phone (expect 400)
3. Create worker with invalid coordinates (expect 400)
4. Create shift with invalid time format (expect 400)

---

## Notes for Testing

- Replace placeholder IDs with actual IDs returned from API responses
- All date-time values should be in ISO 8601 format (UTC)
- Phone numbers must be 9-11 digits
- Coordinates must be valid geographic values
- Use proper access tokens for authenticated endpoints
- Different roles have different access permissions
- Some fields are optional - test both with and without them
