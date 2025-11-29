# Zalo NutriChat - Project Structure

## Tổng quan

Zalo NutriChat là một Mini App trên nền tảng Zalo, giúp người dùng tư vấn dinh dưỡng thông qua chat với AI.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/UI, Axios
- **Backend**: Python FastAPI, Groq API, Pydantic
- **Integration**: Zalo OA API

## Cấu trúc thư mục

```
VNG.cursor-hackathon/
├── frontend/                 # Next.js 14 App
│   ├── app/
│   │   ├── page.tsx         # Main chat interface
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ChatBubble.tsx
│   │   └── FoodCard.tsx
│   ├── lib/
│   │   └── types.ts         # TypeScript types matching backend schemas
│   └── package.json
│
├── backend/                  # FastAPI Backend
│   ├── main.py              # FastAPI app & routes
│   ├── schemas.py           # Pydantic models
│   ├── services/
│   │   └── zalo_service.py  # Zalo API integration
│   ├── requirements.txt
│   └── .env                 # Environment variables
│
├── groq-system-prompt.md    # System prompt cho Groq
├── cursor-prompts.md        # Các prompt template cho Cursor
└── README.md
```

## API Endpoints

### Backend (FastAPI)

- `POST /api/chat` - Nhận user query, trả về nutrition info và suggested foods
- `GET /api/user/summary` - Lấy thông tin tổng hợp của user (mock)
- `POST /api/zalo-webhook` - Webhook để nhận events từ Zalo

## Environment Variables

### Backend (.env)

```env
GROQ_API_KEY=your_groq_api_key
ZALO_ACCESS_TOKEN=your_zalo_access_token
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Development Workflow

1. **Setup Backend**: 
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # hoặc venv\Scripts\activate trên Windows
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Testing**: 
   - Backend chạy tại `http://localhost:8000`
   - Frontend chạy tại `http://localhost:3000`
   - Test API với Postman hoặc curl

## Notes

- Backend phải có CORS enabled để Frontend có thể gọi API
- Groq API response phải là JSON thuần, không có markdown
- Zalo webhook cần public URL (dùng ngrok cho local dev)


