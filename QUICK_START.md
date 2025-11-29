# 🚀 Hướng dẫn chạy project NutriChat

## 📋 Yêu cầu hệ thống

- **Node.js**: >= 18.x (khuyến nghị >= 20.x cho frontend)
- **pnpm**: >= 8.x (hoặc npm/yarn)
- **Firebase Service Account Key**: Đã có sẵn trong project
- **Groq API Key**: Cần lấy từ [Groq Console](https://console.groq.com/)

---

## 🔧 Bước 1: Cấu hình Backend

### 1.1. Cài đặt dependencies

```bash
cd server
pnpm install
```

### 1.2. Tạo file `.env` trong thư mục `server/`

```bash
cd server
touch .env
```

Thêm nội dung sau vào file `.env`:

```env
# Groq AI Configuration
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20

# API URLs
NEXT_PUBLIC_API_URL_CLIENTS=http://localhost:3000
NEXT_PUBLIC_API_URL_SERVER=http://localhost:3002

# Ports
NEXT_PUBLIC_API_PORT_CLIENTS=3000
NEXT_PUBLIC_API_PORT_SERVER=3002

# App Name
BRAND_APP_NAME=NutriChat Server
```

**Lưu ý**: Thay `your_groq_api_key_here` bằng API key thật từ Groq Console.

### 1.3. Kiểm tra Firebase Service Account Key

Đảm bảo file `cursor-hackathon-2e617-firebase-adminsdk-fbsvc-93b16413db.json` đã có trong thư mục gốc của project (cùng cấp với thư mục `server`).

### 1.4. Chạy Backend Server

```bash
cd server
pnpm dev
```

Server sẽ chạy tại: `http://localhost:3002`

Kiểm tra server đang hoạt động:
```bash
curl http://localhost:3002/api/v1/
```

---

## 🎨 Bước 2: Cấu hình Frontend

### 2.1. Cài đặt dependencies

```bash
cd frontend
npm install
```

### 2.2. Tạo file `.env.local` trong thư mục `frontend/`

```bash
cd frontend
touch .env.local
```

Thêm nội dung sau vào file `.env.local`:

```env
NEXT_PUBLIC_API_URL_SERVER=http://localhost:3002
```

### 2.3. (Tùy chọn) Thêm Static Images

Tạo 7 file images placeholder trong `frontend/public/images/`:
- `noodle.png`
- `rice.png`
- `soup.png`
- `salad.png`
- `fastfood.png`
- `drink.png`
- `default.png`

**Lưu ý**: Nếu chưa có images, app vẫn chạy được nhưng sẽ hiển thị broken image. Bạn có thể bỏ qua bước này và thêm sau.

### 2.4. Chạy Frontend

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

---

## ✅ Bước 3: Kiểm tra

1. Mở browser và truy cập: `http://localhost:3000`
2. Bạn sẽ thấy giao diện Chat
3. Thử gửi một message như: "Sáng nay ăn gì cho healthy?"
4. AI sẽ trả về 3 gợi ý món ăn
5. Click vào một Food Card để xem chi tiết
6. Click "Ăn món này" để lưu vào nhật ký
7. Chuyển sang tab Dashboard để xem thống kê

---

## 🐛 Troubleshooting

### Backend không chạy được

1. **Lỗi Firebase**: Kiểm tra file Service Account Key có đúng vị trí không
2. **Lỗi GROQ_API_KEY**: Đảm bảo đã thêm API key vào `.env`
3. **Port đã được sử dụng**: Thay đổi port trong `.env` hoặc kill process đang dùng port 3002

```bash
# Kiểm tra port 3002
lsof -i :3002

# Kill process nếu cần
kill -9 <PID>
```

### Frontend không chạy được

1. **Lỗi Node version**: Frontend yêu cầu Node >= 20.9.0, nhưng có thể chạy với Node 18 (có warnings)
2. **Lỗi API connection**: Kiểm tra `NEXT_PUBLIC_API_URL_SERVER` trong `.env.local` có đúng không
3. **Port đã được sử dụng**: Thay đổi port hoặc kill process

```bash
# Kiểm tra port 3000
lsof -i :3000
```

### API không kết nối được

1. Đảm bảo backend đang chạy trước khi start frontend
2. Kiểm tra CORS settings trong `server/src/configs/cors.ts`
3. Kiểm tra network tab trong browser DevTools để xem lỗi cụ thể

---

## 📝 Scripts có sẵn

### Backend (trong `server/`)

```bash
pnpm dev          # Chạy development với hot reload
pnpm dev:debug    # Chạy với debug mode
pnpm build        # Build production
pnpm start        # Chạy production (cần build trước)
pnpm lint         # Kiểm tra code style
pnpm lint:fix     # Tự động sửa code style
pnpm seed         # Seed data vào database
```

### Frontend (trong `frontend/`)

```bash
npm run dev       # Chạy development
npm run build     # Build production
npm run start     # Chạy production (cần build trước)
npm run lint      # Kiểm tra code style
```

---

## 🔑 Lấy Groq API Key

1. Truy cập: https://console.groq.com/
2. Đăng ký/Đăng nhập
3. Vào phần API Keys
4. Tạo API key mới
5. Copy và paste vào file `server/.env`

---

## 📱 Test trên Mobile

1. Tìm địa chỉ IP của máy:
   ```bash
   # Linux/Mac
   ifconfig | grep "inet "
   
   # Hoặc
   ip addr show
   ```

2. Cập nhật `.env.local` trong frontend:
   ```env
   NEXT_PUBLIC_API_URL_SERVER=http://YOUR_IP:3002
   ```

3. Cập nhật CORS trong backend để cho phép IP của bạn

4. Truy cập từ mobile: `http://YOUR_IP:3000`

---

## 🎯 Next Steps

Sau khi chạy được project:

1. ✅ Test Chat functionality
2. ✅ Test Food logging
3. ✅ Test Dashboard
4. ⬜ Thêm static images vào `frontend/public/images/`
5. ⬜ Customize UI/UX nếu cần
6. ⬜ Deploy lên production (Vercel cho frontend, Railway/Render cho backend)

---

## 💡 Tips

- Luôn chạy backend trước khi chạy frontend
- Sử dụng 2 terminal windows: một cho backend, một cho frontend
- Kiểm tra console logs để debug
- Sử dụng browser DevTools để kiểm tra network requests

Chúc bạn code vui vẻ! 🚀

