# User API Endpoints

Complete API documentation for User management endpoints.

## Base URL

```txt
http://localhost:PORT/api
```

## Endpoints

### 1. Get User by ID

Get a specific user by their ID.

**Endpoint:** `GET /users/:id`

**Parameters:**

- `id` (path parameter) - User ID

**Example:**

```bash
curl http://localhost:3000/api/users/abc123
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "photoURL": "https://example.com/photo.jpg",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "error": "User not found"
}
```

---

### 2. Get All Users (Paginated)

Get a paginated list of all users.

**Endpoint:** `GET /users?page=1&limit=10`

**Query Parameters:**

- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page

**Example:**

```bash
curl "http://localhost:3000/api/users?page=1&limit=10"
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "email": "user1@example.com",
      "displayName": "John Doe",
      "role": "user",
      "isActive": true
    },
    // ... more users
  ],
  "total": 50,
  "hasMore": true,
  "page": 1,
  "limit": 10
}
```

---

### 3. Get User by Email

Find a user by their email address.

**Endpoint:** `GET /users/search?email=user@example.com`

**Query Parameters:**

- `email` (required) - User email address

**Example:**

```bash
curl "http://localhost:3000/api/users/search?email=user@example.com"
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "user"
  }
}
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "error": "User not found"
}
```

---

### 4. Create User

Create a new user.

**Endpoint:** `POST /users`

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "displayName": "Jane Smith",
  "photoURL": "https://example.com/photo.jpg",
  "phoneNumber": "+1234567890",
  "role": "user",
  "isActive": true
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "displayName": "Jane Smith",
    "role": "user",
    "isActive": true
  }'
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": "xyz789",
    "email": "newuser@example.com",
    "displayName": "Jane Smith",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

**Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "issues": [
      {
        "path": ["email"],
        "message": "Invalid email format"
      }
    ]
  }
}
```

---

### 5. Update User

Update an existing user.

**Endpoint:** `PUT /users/:id`

**Parameters:**

- `id` (path parameter) - User ID

**Request Body:** (all fields optional)

```json
{
  "displayName": "John Updated",
  "isActive": false,
  "role": "admin"
}
```

**Example:**

```bash
curl -X PUT http://localhost:3000/api/users/abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "John Updated"
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "email": "user@example.com",
    "displayName": "John Updated",
    "role": "admin",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

---

### 6. Delete User

Delete a user by ID.

**Endpoint:** `DELETE /users/:id`

**Parameters:**

- `id` (path parameter) - User ID

**Example:**

```bash
curl -X DELETE http://localhost:3000/api/users/abc123
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Response (404 Not Found):**

```json
{
  "success": false,
  "error": "User not found"
}
```

---

### 7. Get Users by Role

Get all users with a specific role.

**Endpoint:** `GET /users/role/:role`

**Parameters:**

- `role` (path parameter) - User role (user, admin, moderator)

**Example:**

```bash
curl http://localhost:3000/api/users/role/admin
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "email": "admin@example.com",
      "displayName": "Admin User",
      "role": "admin"
    }
  ],
  "count": 1
}
```

---

### 8. Get Active Users

Get all active users.

**Endpoint:** `GET /users/active`

**Example:**

```bash
curl http://localhost:3000/api/users/active
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "email": "user@example.com",
      "displayName": "John Doe",
      "isActive": true
    }
  ],
  "count": 5
}
```

---

## Testing with Your Seed Data

You can test these endpoints with the fake users created by your seed script:

```bash
# 1. Get all users
curl http://localhost:3000/api/users

# 2. Copy a user ID from the response, then get that user
curl http://localhost:3000/api/users/USER_ID_HERE

# 3. Get active users
curl http://localhost:3000/api/users/active

# 4. Get users by role
curl http://localhost:3000/api/users/role/user
```

## Error Handling

All endpoints return consistent error responses:

**500 Internal Server Error:**

```json
{
  "success": false,
  "error": "Internal server error"
}
```

**400 Bad Request:**

```json
{
  "success": false,
  "error": "Validation error",
  "details": { /* Zod validation errors */ }
}
```

## Notes

- All timestamps are in ISO 8601 format
- User roles: `user`, `admin`, `moderator`
- Email validation is enforced by Zod schema
- Pagination defaults: page=1, limit=10
