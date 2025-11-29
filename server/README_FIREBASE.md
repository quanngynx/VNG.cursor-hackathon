# 🔥 Firebase + Zod + TypeScript Setup

Complete type-safe Firebase integration with Zod validation for your Node.js/Express server.

## 📦 What's Included

- ✅ Firebase Admin SDK setup
- ✅ Zod schemas for data validation
- ✅ Type-safe repository pattern
- ✅ Example controllers and services
- ✅ Complete documentation

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Firebase Setup

Make sure your Firebase service account key is in the project root:

```txt
VNG.cursor-hackathon/
├── cursor-hackathon-2e617-firebase-adminsdk-fbsvc-93b16413db.json
└── server/
```

### 3. Start Development Server

```bash
pnpm dev
```

## 📚 Documentation

- **[FIREBASE_SETUP_SUMMARY.md](./FIREBASE_SETUP_SUMMARY.md)** - Complete overview
- **[FIREBASE_SCHEMA_GUIDE.md](./FIREBASE_SCHEMA_GUIDE.md)** - Detailed guide with examples
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference

## 💡 Basic Usage

### Using Repositories

```typescript
import { FoodLogRepository } from '@/repositories/food-log.repository'

const foodLogRepo = new FoodLogRepository()

// Create a food log
const log = await foodLogRepo.create({
  userId: 'user123',
  foodName: 'Grilled Chicken',
  mealType: 'lunch',
  portion: '150g',
  nutrition: {
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
  },
  loggedAt: new Date(),
})

// Query data
const userLogs = await foodLogRepo.findByUserId('user123')
const dailyNutrition = await foodLogRepo.getTotalNutritionByDate('user123', new Date())
```

### Using Controllers

```typescript
// Add to your routes
import { foodLogRouter } from './routes/food-log.routes'
app.use('/api', foodLogRouter)
```

## 📁 Project Structure

```bash
server/src/
├── configs/
│   └── firebase.ts           # Firebase initialization
├── schemas/                  # Zod schemas for validation
│   ├── base.schema.ts
│   ├── user.schema.ts
│   ├── food-log.schema.ts
│   └── chat-message.schema.ts
├── repositories/             # Data access layer
│   ├── base.repository.ts
│   ├── user.repository.ts
│   ├── food-log.repository.ts
│   └── chat-message.repository.ts
├── controllers/              # Request handlers
│   └── food-log.controller.ts
├── services/                 # Business logic
│   └── example-firebase.service.ts
└── routes/                   # API routes
    └── food-log.routes.ts
```

## 🎯 Key Features

### Type Safety

```typescript
// Full TypeScript support
const user: User = await userRepo.findById('userId')
user.email // ✅ Autocomplete works
user.invalid // ❌ TypeScript error
```

### Automatic Validation

```typescript
// Zod validates automatically
await userRepo.create({
  email: 'invalid-email', // ❌ Throws validation error
  displayName: 'John',
})
```

### Clean Query API

```typescript
const logs = await foodLogRepo.findAll({
  where: [
    { field: 'userId', operator: '==', value: 'user123' },
    { field: 'mealType', operator: '==', value: 'lunch' },
  ],
  orderBy: { field: 'loggedAt', direction: 'desc' },
  limit: 10,
})
```

### Built-in Pagination

```typescript
const result = await foodLogRepo.findPaginated(1, 10)
// Returns: { data: [], total: 45, hasMore: true, page: 1, limit: 10 }
```

## 🔧 Adding New Collections

1. Create schema in `src/schemas/your-collection.schema.ts`
2. Create repository in `src/repositories/your-collection.repository.ts`
3. Use in controllers/services

See [FIREBASE_SCHEMA_GUIDE.md](./FIREBASE_SCHEMA_GUIDE.md) for detailed examples.

## 📖 Available Collections

- **Users** - User accounts and profiles
- **Food Logs** - Food consumption tracking with nutrition
- **Chat Messages** - Conversation history

## 🛠️ Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Run production build
pnpm lint         # Lint code
pnpm lint:fix     # Fix linting issues
```

## 📝 License

MIT

---

**Need help?** Check the documentation files:

- [Complete Setup Summary](./FIREBASE_SETUP_SUMMARY.md)
- [Schema Guide](./FIREBASE_SCHEMA_GUIDE.md)
- [Quick Start](./QUICK_START.md)
