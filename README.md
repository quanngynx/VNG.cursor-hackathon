# VNG.cursor-hackathon

Dự án backend API sử dụng Node.js, TypeScript, Express và Firebase Firestore.

## 📋 Yêu cầu hệ thống

- **Node.js**: 
  - Backend: >= 18.x
  - Frontend: >= 20.9.0 (Next.js 16 requirement)
- **pnpm**: >= 8.x (hoặc npm/yarn)
- **Firebase Service Account Key**: File JSON từ Firebase Console

## 🚀 Cài đặt và Chạy dự án

### 1. Cài đặt dependencies

```bash
cd server
pnpm install
```

### 2. Cấu hình Firebase

1. Tải Firebase Service Account Key từ Firebase Console
2. Đặt file JSON vào thư mục gốc của project (cùng cấp với thư mục `server`)
3. Đảm bảo tên file khớp với cấu hình trong `server/src/configs/firebase.ts`

**Lưu ý**: Mặc định file cần có tên: `cursor-hackathon-2e617-firebase-adminsdk-fbsvc-93b16413db.json`

### 3. Cấu hình biến môi trường (tùy chọn)

Tạo file `.env` trong thư mục `server` nếu cần thay đổi các giá trị mặc định:

```env
# API URLs
NEXT_PUBLIC_API_URL_CLIENTS=http://localhost:3000
NEXT_PUBLIC_API_URL_SERVER=http://localhost:3002

# Ports
NEXT_PUBLIC_API_PORT_CLIENTS=3000
NEXT_PUBLIC_API_PORT_SERVER=3002

# App Name
BRAND_APP_NAME=VNG.cursor-hackathon Server
```

### 4. Chạy dự án

#### Development mode (với hot reload)

```bash
pnpm dev
```

#### Production mode

```bash
# Build project
pnpm build

# Chạy server
pnpm start
```

### 5. Kiểm tra

Server sẽ chạy tại: `http://localhost:3002` (hoặc port được cấu hình)

Kiểm tra API đang hoạt động:
```bash
curl http://localhost:3002/
```

## 📁 Cấu trúc dự án

```
VNG.cursor-hackathon/
├── server/                          # Backend server
│   ├── src/
│   │   ├── app.ts                   # Express app configuration
│   │   ├── main.ts                  # Entry point
│   │   ├── configs/                 # Configuration files
│   │   │   ├── cors.ts              # CORS configuration
│   │   │   └── firebase.ts          # Firebase initialization
│   │   ├── controllers/             # Request handlers
│   │   │   └── food-log.controller.ts
│   │   ├── middlewares/             # Express middlewares
│   │   │   └── request-context.middleware.ts
│   │   ├── repositories/            # Data access layer
│   │   │   ├── base.repository.ts  # Base repository class
│   │   │   ├── user.repository.ts
│   │   │   ├── food-log.repository.ts
│   │   │   ├── chat-message.repository.ts
│   │   │   └── index.ts
│   │   ├── routes/                  # API routes
│   │   │   ├── router.v1.ts        # Main router
│   │   │   └── food-log.routes.ts
│   │   ├── schemas/                 # Zod validation schemas
│   │   │   ├── base.schema.ts
│   │   │   ├── user.schema.ts
│   │   │   ├── food-log.schema.ts
│   │   │   ├── chat-message.schema.ts
│   │   │   └── index.ts
│   │   ├── services/                # Business logic layer
│   │   │   └── example-firebase.service.ts
│   │   ├── scripts/                 # Utility scripts
│   │   │   ├── seed-data.ts        # Database seeding
│   │   │   └── README.md
│   │   └── venv/                    # Environment variables
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json                # TypeScript configuration
│   ├── nodemon.json                 # Nodemon configuration
│   └── eslint.config.mjs            # ESLint configuration
├── docs/                            # Project documentation
│   ├── 01_Requirements_and_Scope.md
│   ├── 02_System_Architecture.md
│   ├── 03_UI_UX_Flow.md
│   └── 04_Implementation_Plan.md
├── LICENSE
└── README.md                         # File này
```

## 🛠️ Scripts có sẵn

Trong thư mục `server/`:

| Script | Mô tả |
|--------|-------|
| `pnpm dev` | Chạy server ở chế độ development với hot reload |
| `pnpm dev:debug` | Chạy server ở chế độ debug |
| `pnpm start` | Chạy server ở chế độ production (cần build trước) |
| `pnpm build` | Build TypeScript sang JavaScript |
| `pnpm build:watch` | Build và watch cho changes |
| `pnpm test` | Chạy tests |
| `pnpm test:watch` | Chạy tests ở chế độ watch |
| `pnpm lint` | Kiểm tra code style |
| `pnpm lint:fix` | Tự động sửa code style |
| `pnpm clean` | Xóa thư mục build |
| `pnpm seed` | Chạy script seed data vào database |

## 📚 Tài liệu tham khảo

- `server/QUICK_START.md` - Hướng dẫn nhanh về cách sử dụng repositories và services
- `server/FIREBASE_SCHEMA_GUIDE.md` - Hướng dẫn chi tiết về Firebase schemas
- `server/FIREBASE_SETUP_SUMMARY.md` - Tóm tắt về cấu trúc Firebase setup
- `server/SEED_DATA_GUIDE.md` - Hướng dẫn seed data
- `docs/` - Tài liệu về requirements, architecture, và implementation plan

## 🏗️ Kiến trúc

Dự án sử dụng các pattern sau:

- **Repository Pattern**: Tách biệt logic truy cập dữ liệu
- **Service Layer**: Xử lý business logic
- **Controller Layer**: Xử lý HTTP requests/responses
- **Schema Validation**: Sử dụng Zod cho type safety và validation
- **TypeScript**: Full type safety

## 🔧 Công nghệ sử dụng

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Validation**: Zod
- **Security**: Helmet, CORS
- **Logging**: Winston
- **Package Manager**: pnpm

## 📝 Lưu ý

- Đảm bảo Firebase Service Account Key được đặt đúng vị trí và có quyền truy cập Firestore
- Port mặc định là `3002`, có thể thay đổi qua biến môi trường `NEXT_PUBLIC_API_PORT_SERVER`
- API base path: `/api/v1`
