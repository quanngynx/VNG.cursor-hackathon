# Quick Start Guide

## Setup

1. **Install dependencies**:
```bash
pnpm install
```

2. **Configure environment**: Make sure your Firebase service account key is in the root directory.

3. **Start the server**:
```bash
pnpm dev
```

## Usage Examples

### 1. Using Repositories Directly

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

// Query by user
const userLogs = await foodLogRepo.findByUserId('user123')

// Get daily nutrition
const dailyNutrition = await foodLogRepo.getTotalNutritionByDate(
  'user123',
  new Date()
)
```

### 2. Using Services

```typescript
import { ExampleFirebaseService } from '@/services/example-firebase.service'

const firebaseService = new ExampleFirebaseService()

// Create user
const user = await firebaseService.createUser({
  email: 'user@example.com',
  displayName: 'John Doe',
  role: 'user',
  isActive: true,
})

// Log a meal
const meal = await firebaseService.logMeal({
  userId: user.data.id,
  foodName: 'Oatmeal',
  mealType: 'breakfast',
  portion: '1 cup',
  nutrition: {
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
  },
  loggedAt: new Date(),
})

// Get nutrition summary
const summary = await firebaseService.getDailyNutritionSummary(user.data.id)
```

### 3. API Endpoints

Add to your `router.v1.ts`:

```typescript
import { foodLogRouter } from './food-log.routes'

router.use('/v1', foodLogRouter)
```

Then use the endpoints:
- `POST /api/v1/food-logs` - Create food log
- `GET /api/v1/food-logs/user/:userId` - Get user's food logs
- `GET /api/v1/food-logs/user/:userId/summary?date=2024-01-15` - Get daily summary

## Type Safety

All operations are type-safe:

```typescript
// ✅ This works
const log = await foodLogRepo.create({
  userId: 'user123',
  foodName: 'Chicken',
  mealType: 'lunch', // Must be one of: 'breakfast', 'lunch', 'dinner', 'snack'
  portion: '150g',
  nutrition: {
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
  },
  loggedAt: new Date(),
})

// ❌ This won't compile
const log = await foodLogRepo.create({
  userId: 'user123',
  foodName: 'Chicken',
  mealType: 'brunch', // Error: Type 'brunch' is not assignable
  // ...
})
```

## Validation

All data is validated using Zod schemas:

```typescript
try {
  const log = await foodLogRepo.create(data)
} catch (error) {
  if (error instanceof z.ZodError) {
    // Handle validation errors
    console.error(error.errors)
  }
}
```

For more details, see `FIREBASE_SCHEMA_GUIDE.md`.

