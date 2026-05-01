# Worker Shuttle System - API Documentation

## Overview
This document provides comprehensive documentation of all API endpoints in the Worker Shuttle System backend service.

**Base URL:** `http://localhost:3000`

---

## Authentication

### 1. User Login
- **Endpoint:** `POST /auth/login`
- **Description:** Login user and get access and refresh tokens
- **Access:** Public
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "access_token": "string",
    "refresh_token": "string",
    "user": {
      "_id": "string",
      "username": "string",
      "fullname": "string",
      "phone": "string",
      "role": "admin|driver|worker|dispatcher",
      "is_active": "boolean",
      "last_login_at": "ISO8601 datetime"
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized` - Invalid credentials
  - `400 Bad Request` - Missing required fields

### 2. Refresh Access Token
- **Endpoint:** `POST /auth/refresh`
- **Description:** Get a new access token using refresh token
- **Access:** Public (requires valid refresh token)
- **Headers:**
  ```
  Authorization: Bearer {refreshToken}
  ```
- **Request Body:**
  ```json
  {
    "refreshToken": "string"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "access_token": "string",
    "refresh_token": "string"
  }
  ```

### 3. User Logout
- **Endpoint:** `POST /auth/logout`
- **Description:** Logout the current user
- **Access:** Authenticated users
- **Headers:**
  ```
  Authorization: Bearer {accessToken}
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Logout successful"
  }
  ```

---

## Users Management

### 4. Create New User
- **Endpoint:** `POST /users`
- **Description:** Create a new user account
- **Access:** Admin only
- **Headers:**
  ```
  Authorization: Bearer {adminAccessToken}
  ```
- **Request Body:**
  ```json
  {
    "username": "string (3-30 chars)",
    "password": "string (8-100 chars)",
    "fullname": "string (max 100 chars)",
    "phone": "string (9-11 digits)",
    "role": "admin|driver|worker|dispatcher",
    "is_active": "boolean (optional, default: true)",
    "last_login_at": "ISO8601 datetime (optional)",
    "fcm_token": "string (optional, max 255 chars)"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "_id": "string",
    "username": "string",
    "fullname": "string",
    "phone": "string",
    "role": "string",
    "is_active": "boolean",
    "created_at": "ISO8601 datetime"
  }
  ```
- **Validation Rules:**
  - username: 3-30 characters minimum
  - password: 8-100 characters minimum
  - phone: 9-11 digits only
  - role: Must be one of enum values

### 5. Set User Account Status
- **Endpoint:** `POST /users/set-account-status`
- **Description:** Activate or deactivate a user account
- **Access:** Admin only
- **Headers:**
  ```
  Authorization: Bearer {adminAccessToken}
  ```
- **Request Body:**
  ```json
  {
    "username": "string",
    "is_active": "boolean"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Account status updated",
    "user": {
      "_id": "string",
      "username": "string",
      "is_active": "boolean"
    }
  }
  ```

---

## Drivers Management

### 6. Create Driver with User Account
- **Endpoint:** `POST /drivers/create-with-user`
- **Description:** Create a new driver and their associated user account
- **Access:** Admin only
- **Headers:**
  ```
  Authorization: Bearer {adminAccessToken}
  ```
- **Request Body:**
  ```json
  {
    "createUserDto": {
      "username": "string",
      "password": "string",
      "fullname": "string",
      "phone": "string",
      "role": "driver",
      "is_active": "boolean (optional)",
      "fcm_token": "string (optional)"
    },
    "createDriverDto": {
      "user_id": "string",
      "license_number": "string",
      "license_expires_at": "ISO8601 datetime (optional)"
    }
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "user": {
      "_id": "string",
      "username": "string",
      "fullname": "string",
      "phone": "string",
      "role": "driver"
    },
    "driver": {
      "_id": "string",
      "user_id": "string",
      "license_number": "string",
      "license_expires_at": "ISO8601 datetime"
    }
  }
  ```

---

## Workers Management

### 7. Create Worker with User Account
- **Endpoint:** `POST /workers`
- **Description:** Create a new worker and their associated user account
- **Access:** Admin only
- **Headers:**
  ```
  Authorization: Bearer {adminAccessToken}
  ```
- **Request Body:**
  ```json
  {
    "createUserDto": {
      "username": "string",
      "password": "string",
      "fullname": "string",
      "phone": "string",
      "role": "worker",
      "is_active": "boolean (optional)",
      "fcm_token": "string (optional)"
    },
    "createWorkerDto": {
      "employee_code": "string",
      "department": "string (optional)",
      "pickup_address": "string",
      "pickup_lat": "number (-90 to 90)",
      "pickup_lng": "number (-180 to 180)",
      "default_shift_id": "string (optional)"
    }
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "user": {
      "_id": "string",
      "username": "string",
      "fullname": "string",
      "phone": "string",
      "role": "worker"
    },
    "worker": {
      "_id": "string",
      "user_id": "string",
      "employee_code": "string",
      "department": "string",
      "pickup_address": "string",
      "pickup_lat": "number",
      "pickup_lng": "number",
      "default_shift_id": "string"
    }
  }
  ```
- **Validation Rules:**
  - pickup_lat: Must be between -90 and 90
  - pickup_lng: Must be between -180 and 180
  - employee_code: Required

---

## Vehicles Management

### 8. Create Vehicle
- **Endpoint:** `POST /vehicles`
- **Description:** Create a new vehicle record
- **Access:** Admin only
- **Headers:**
  ```
  Authorization: Bearer {adminAccessToken}
  ```
- **Request Body:**
  ```json
  {
    "plate_number": "string",
    "vehicle_type": "string",
    "capacity": "number (>= 0)",
    "contractor_name": "string (optional)",
    "contractor_phone": "string (optional)",
    "status": "available|in_use|maintenance|retired (optional, default: available)",
    "notes": "string (optional)"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "_id": "string",
    "plate_number": "string",
    "vehicle_type": "string",
    "capacity": "number",
    "contractor_name": "string",
    "contractor_phone": "string",
    "status": "string",
    "notes": "string",
    "created_at": "ISO8601 datetime"
  }
  ```
- **Validation Rules:**
  - plate_number: Required
  - vehicle_type: Required
  - capacity: Must be >= 0

---

## Shifts Management

### 9. Create Shift
- **Endpoint:** `POST /shifts`
- **Description:** Create a new work shift schedule
- **Access:** Admin only
- **Headers:**
  ```
  Authorization: Bearer {adminAccessToken}
  ```
- **Request Body:**
  ```json
  {
    "name": "string",
    "start_time": "string (HH:mm format)",
    "factory_arrival_deadline": "string (HH:mm format)",
    "is_active": "boolean (optional, default: true)"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "_id": "string",
    "name": "string",
    "start_time": "string",
    "factory_arrival_deadline": "string",
    "is_active": "boolean",
    "created_at": "ISO8601 datetime"
  }
  ```
- **Validation Rules:**
  - start_time: Must be in HH:mm format (00:00 - 23:59)
  - factory_arrival_deadline: Must be in HH:mm format

---

## Weekly Registrations

### 10. Create Weekly Registration
- **Endpoint:** `POST /weekly-registrations`
- **Description:** Register a worker for a shift on a specific date
- **Access:** Worker only
- **Headers:**
  ```
  Authorization: Bearer {workerAccessToken}
  ```
- **Request Body:**
  ```json
  {
    "worker_id": "string",
    "shift_id": "string",
    "trip_date": "string (YYYY-MM-DD format)",
    "status": "registered|cancelled|missed (optional, default: registered)",
    "cancel_reason": "string (optional)",
    "iso_week": "number (optional)",
    "iso_year": "number (optional)"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "_id": "string",
    "worker_id": "string",
    "shift_id": "string",
    "trip_date": "string",
    "status": "string",
    "cancel_reason": "string",
    "iso_week": "number",
    "iso_year": "number",
    "created_at": "ISO8601 datetime"
  }
  ```
- **Validation Rules:**
  - trip_date: Must be in YYYY-MM-DD format
  - worker_id: Required
  - shift_id: Required

---

## Health Check

### 11. Get Hello Message
- **Endpoint:** `GET /`
- **Description:** Health check endpoint
- **Access:** Public
- **Response (200 OK):**
  ```
  Hello World!
  ```

---

## Error Handling

### Standard Error Response Format
```json
{
  "statusCode": "number",
  "message": "string",
  "error": "string"
}
```

### Common Error Codes
- `400 Bad Request` - Invalid input data or validation error
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - User doesn't have permission to access resource
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Role-Based Access Control

### Available Roles
- **ADMIN** - Full access to all operations
- **DRIVER** - Can manage driver-related operations
- **WORKER** - Can register for shifts and manage personal data
- **DISPATCHER** - Can manage dispatch operations

### Protected Routes Summary
| Endpoint | Required Role |
|----------|---------------|
| POST /users | ADMIN |
| POST /users/set-account-status | ADMIN |
| POST /drivers/create-with-user | ADMIN |
| POST /workers | ADMIN |
| POST /vehicles | ADMIN |
| POST /shifts | ADMIN |
| POST /weekly-registrations | WORKER |
| POST /auth/login | Public |
| POST /auth/refresh | Public |
| POST /auth/logout | Any |
| GET / | Public |

---

## Authentication Flow

1. **Login** - User sends credentials to `POST /auth/login`
2. **Receive Tokens** - Server returns `access_token` and `refresh_token`
3. **Use Access Token** - Include `Authorization: Bearer {access_token}` in protected endpoints
4. **Token Expiration** - When access token expires, use `POST /auth/refresh` with refresh token
5. **Logout** - Send `POST /auth/logout` to invalidate tokens

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Phone numbers must be 9-11 digits
- Coordinates (latitude/longitude) follow standard geographic ranges
- All string fields are subject to maximum length validation
- Whitelist validation is enabled - only specified fields are accepted in requests
