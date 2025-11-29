# 📋 Danh sách các tính năng còn thiếu so với Documentation

## 🔴 PHẦN 1: BACKEND - Các tính năng còn thiếu

### 1.1. Groq AI Integration (CRITICAL - Core Feature)
**Trạng thái:** ❌ Chưa có

**Yêu cầu từ docs:**
- Tích hợp Groq SDK để gọi AI API
- Model: `openai/gpt-oss-20`
- System Prompt để trả về JSON với 3 món ăn gợi ý

**Cần làm:**
1. ✅ Cài đặt `groq-sdk` package (chưa có trong `package.json`)
2. ✅ Tạo file `server/src/services/aiService.ts` hoặc `groq.service.ts`
3. ✅ Implement function `generateFoodSuggestions(userMessage: string)`
4. ✅ Cấu hình GROQ_API_KEY trong environment variables
5. ✅ System Prompt theo spec (Vietnamese, JSON output với reply + suggestions array)

**File cần tạo:**
- `server/src/services/ai.service.ts` hoặc `groq.service.ts`

---

### 1.2. Chat API Endpoint (CRITICAL - Core Feature)
**Trạng thái:** ❌ Chưa có

**Yêu cầu từ docs:**
- Endpoint: `POST /api/v1/chat` (hoặc `/api/chat` theo docs)
- Request: `{ userId: string, message: string }`
- Response: `{ reply: string, suggestions: Array<FoodSuggestion> }`

**Cần làm:**
1. ✅ Tạo `server/src/controllers/chat.controller.ts`
2. ✅ Tạo `server/src/routes/chat.routes.ts`
3. ✅ Tạo `server/src/schemas/chat.schema.ts` (nếu chưa có đầy đủ)
4. ✅ Kết nối với AI Service
5. ✅ Lưu chat messages vào Firestore (có repository rồi nhưng chưa dùng)

**Files cần tạo/cập nhật:**
- `server/src/controllers/chat.controller.ts` (mới)
- `server/src/routes/chat.routes.ts` (mới)
- `server/src/routes/router.v1.ts` (thêm route chat)

---

### 1.3. API Endpoints theo đúng spec docs
**Trạng thái:** ⚠️ Có nhưng khác format

**Vấn đề:**
- Docs yêu cầu: `POST /api/log` và `GET /api/summary`
- Hiện tại có: `POST /api/v1/food-logs` và `GET /api/v1/food-logs/user/:userId/summary`

**Cần làm:**
1. ✅ Tạo aliases hoặc routes mới để match với docs:
   - `POST /api/v1/log` → redirect hoặc wrapper cho `POST /api/v1/food-logs`
   - `GET /api/v1/summary?userId=xxx&date=xxx` → wrapper cho summary endpoint hiện tại
2. ✅ Hoặc cập nhật docs để match với implementation hiện tại

**Files cần tạo/cập nhật:**
- `server/src/routes/router.v1.ts` (thêm aliases)
- Hoặc tạo `server/src/routes/legacy.routes.ts` cho backward compatibility

---

### 1.4. Chat Message Repository Integration
**Trạng thái:** ⚠️ Có repository nhưng chưa dùng

**Yêu cầu:**
- Lưu chat history vào Firestore khi user gửi message
- Lưu bot response vào chat history

**Cần làm:**
1. ✅ Sử dụng `ChatMessageRepository` trong chat controller
2. ✅ Lưu user messages và bot responses

**Files cần cập nhật:**
- `server/src/controllers/chat.controller.ts` (khi tạo)

---

## 🔴 PHẦN 2: FRONTEND - Hoàn toàn chưa có

### 2.1. Next.js Setup
**Trạng thái:** ❌ Chưa có

**Yêu cầu từ docs:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn/UI components

**Cần làm:**
1. ✅ Tạo thư mục `frontend/`
2. ✅ Chạy `npx create-next-app@latest` với TypeScript, Tailwind
3. ✅ Cài đặt Shadcn/UI: `npx shadcn-ui@latest init`
4. ✅ Cài đặt dependencies: `axios`, `recharts`, `lucide-react`
5. ✅ Cấu hình API base URL trong `.env.local`

---

### 2.2. State Management - UserContext
**Trạng thái:** ❌ Chưa có

**Yêu cầu:**
- Quản lý `guestId` trong LocalStorage
- Tự động generate `guestId` nếu chưa có
- Context API để share `guestId` across components

**Cần làm:**
1. ✅ Tạo `frontend/src/contexts/UserContext.tsx`
2. ✅ Implement logic check/generate `guestId` từ LocalStorage
3. ✅ Wrap app với UserProvider

**Files cần tạo:**
- `frontend/src/contexts/UserContext.tsx`

---

### 2.3. Chat Interface (Screen 1)
**Trạng thái:** ❌ Chưa có

**Yêu cầu:**
- Chat UI giống ChatGPT
- User messages (right aligned)
- Bot messages (left aligned) với Food Cards
- Input field + Send button
- Bottom Navigation Bar

**Cần làm:**
1. ✅ Tạo `frontend/src/app/page.tsx` (Chat screen)
2. ✅ Tạo `frontend/src/components/ChatBubble.tsx`
3. ✅ Tạo `frontend/src/components/FoodCard.tsx`
4. ✅ Tạo `frontend/src/components/ChatInput.tsx`
5. ✅ Tích hợp với `POST /api/v1/chat` API
6. ✅ Loading states khi gọi AI

**Files cần tạo:**
- `frontend/src/app/page.tsx`
- `frontend/src/components/ChatBubble.tsx`
- `frontend/src/components/FoodCard.tsx`
- `frontend/src/components/ChatInput.tsx`
- `frontend/src/lib/api.ts` (Axios instance)

---

### 2.4. Food Detail Modal
**Trạng thái:** ❌ Chưa có

**Yêu cầu:**
- Modal/Sheet hiển thị khi click Food Card
- Hiển thị: Name, Description, Macros (Protein, Carbs, Fat), Ingredients
- Button "Eat this" để log food
- Toast notification khi log thành công

**Cần làm:**
1. ✅ Tạo `frontend/src/components/FoodDetailModal.tsx` (dùng Shadcn Dialog)
2. ✅ Tích hợp với `POST /api/v1/food-logs` API
3. ✅ Toast notification (dùng Shadcn Toast hoặc sonner)
4. ✅ Update Dashboard state sau khi log

**Files cần tạo:**
- `frontend/src/components/FoodDetailModal.tsx`

---

### 2.5. Health Dashboard (Screen 2)
**Trạng thái:** ❌ Chưa có

**Yêu cầu:**
- Tab riêng trong Bottom Navigation
- Calorie Progress Bar (Current / 2000 kcal)
- Macro Distribution Pie Chart (Recharts)
- History List (items eaten today)

**Cần làm:**
1. ✅ Tạo `frontend/src/app/dashboard/page.tsx`
2. ✅ Tạo `frontend/src/components/NutriChart.tsx` (Pie Chart với Recharts)
3. ✅ Tạo `frontend/src/components/CalorieProgress.tsx`
4. ✅ Tạo `frontend/src/components/FoodHistoryList.tsx`
5. ✅ Tích hợp với `GET /api/v1/food-logs/user/:userId/summary` API
6. ✅ Auto-refresh khi có food log mới

**Files cần tạo:**
- `frontend/src/app/dashboard/page.tsx`
- `frontend/src/components/NutriChart.tsx`
- `frontend/src/components/CalorieProgress.tsx`
- `frontend/src/components/FoodHistoryList.tsx`

---

### 2.6. Bottom Navigation Bar
**Trạng thái:** ❌ Chưa có

**Yêu cầu:**
- 2 tabs: Chat (Home) và Dashboard
- Mobile-first design
- Fixed ở bottom của screen

**Cần làm:**
1. ✅ Tạo `frontend/src/components/BottomNav.tsx`
2. ✅ Tích hợp vào `frontend/src/app/layout.tsx`
3. ✅ Routing giữa Chat và Dashboard

**Files cần tạo:**
- `frontend/src/components/BottomNav.tsx`
- Cập nhật `frontend/src/app/layout.tsx`

---

### 2.7. Static Food Images
**Trạng thái:** ❌ Chưa có

**Yêu cầu:**
- 5-7 generic food images trong `public/images/`
- Mapping category → image filename

**Cần làm:**
1. ✅ Tạo thư mục `frontend/public/images/`
2. ✅ Thêm images: `noodle.png`, `rice.png`, `soup.png`, `salad.png`, `fastfood.png`, `drink.png`, `default.png`
3. ✅ Implement mapping logic trong `FoodCard.tsx`

**Files cần tạo:**
- `frontend/public/images/*.png` (7 files)

---

### 2.8. TypeScript Types
**Trạng thái:** ❌ Chưa có

**Yêu cầu:**
- Types cho API responses
- Types cho Food Suggestions, Food Logs, etc.

**Cần làm:**
1. ✅ Tạo `frontend/src/types/api.ts`
2. ✅ Define interfaces: `FoodSuggestion`, `ChatResponse`, `DailySummary`, etc.

**Files cần tạo:**
- `frontend/src/types/api.ts`

---

## 📊 Tổng kết

### Backend (Server)
- ✅ Firebase setup: **HOÀN THÀNH**
- ✅ Repositories: **HOÀN THÀNH**
- ✅ Food Log API: **HOÀN THÀNH** (nhưng format khác docs)
- ❌ Groq AI Integration: **THIẾU**
- ❌ Chat API: **THIẾU**
- ⚠️ API Endpoints format: **CẦN ĐIỀU CHỈNH**

### Frontend (Client)
- ❌ Next.js Setup: **THIẾU HOÀN TOÀN**
- ❌ Tất cả UI Components: **THIẾU HOÀN TOÀN**
- ❌ State Management: **THIẾU HOÀN TOÀN**
- ❌ Static Assets: **THIẾU HOÀN TOÀN**

### Ưu tiên thực hiện

**Phase 1 - Backend Core (Quan trọng nhất):**
1. Groq AI Integration
2. Chat API Endpoint
3. Điều chỉnh API endpoints format

**Phase 2 - Frontend Core:**
1. Next.js Setup
2. UserContext & State Management
3. Chat Interface
4. Food Detail Modal

**Phase 3 - Frontend Dashboard:**
1. Health Dashboard
2. Bottom Navigation
3. Static Images

**Phase 4 - Polish:**
1. Error handling
2. Loading states
3. Responsive design testing
4. Deployment

