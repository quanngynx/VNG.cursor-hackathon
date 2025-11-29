#!/bin/bash

# Script để chạy project NutriChat
# Usage: ./RUN_PROJECT.sh

echo "🚀 Starting NutriChat Project..."
echo ""

# Check if .env files exist
if [ ! -f "server/.env" ]; then
    echo "⚠️  File server/.env chưa tồn tại!"
    echo "📝 Đang tạo từ .env.example..."
    cp server/.env.example server/.env
    echo "✅ Đã tạo server/.env"
    echo "⚠️  VUI LÒNG CẬP NHẬT GROQ_API_KEY trong server/.env trước khi chạy!"
    echo ""
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  File frontend/.env.local chưa tồn tại!"
    echo "📝 Đang tạo từ .env.local.example..."
    cp frontend/.env.local.example frontend/.env.local
    echo "✅ Đã tạo frontend/.env.local"
    echo ""
fi

# Check if dependencies are installed
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd server && pnpm install && cd ..
    echo ""
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    echo ""
fi

echo "✅ Setup hoàn tất!"
echo ""
echo "📋 Để chạy project:"
echo ""
echo "1. Terminal 1 - Backend:"
echo "   cd server && pnpm dev"
echo ""
echo "2. Terminal 2 - Frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "🌐 Sau đó mở browser: http://localhost:3000"
echo ""

