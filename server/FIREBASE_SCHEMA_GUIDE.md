# Firebase + Zod Schema Setup Documentation

This document provides a complete guide on how to use the Firebase + Zod schema setup in your server.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Usage Examples](#usage-examples)
4. [API Endpoints](#api-endpoints)

## Overview

This setup provides:

- **Type-safe Firestore operations** using Zod schemas
- **Repository pattern** for clean data access
- **Automatic validation** of all data going in/out of Firestore
- **TypeScript support** with full type inference

## Architecture

### Directory Structure

```
server/src/
├── configs/
│   └── firebase.ts          # Firebase initialization
├── schemas/
│   ├── base.schema.ts       # Base schemas for all documents
│   ├── user.schema.ts       # User collection schema
│   ├── food-log.schema.ts   # Food log collection schema
│   ├── chat-message.schema.ts # Chat message collection schema
│   └── index.ts             # Schema exports
├── repositories/
│   ├── base.repository.ts   # Base repository with CRUD operations
│   ├── user.repository.ts   # User-specific operations
│   ├── food-log.repository.ts # Food log-specific operations
│   ├── chat-message.repository.ts # Chat message operations
│   └── index.ts             # Repository exports
└── controllers/
    └── food-log.controller.ts # Example controller
```

## Usage Examples

### 1. Basic CRUD Operations

```typescript
import { FoodLogRepository } from '@/repositories/food-log.repository'

const foodLogRepo = new FoodLogRepository()

// Create a new food log
const newFoodLog = await foodLogRepo.create({
  userId: 'user123',
  foodName: 'Grilled Chicken Breast',
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

// Find food log by ID
const foodLog = await foodLogRepo.findById('logId123')

// Update food log
const updated = await foodLogRepo.update('logId123', {
  portion: '200g',
  nutrition: {
    calories: 220,
    protein: 41,
    carbs: 0,
    fat: 4.8,
  },
})

// Delete food log
await foodLogRepo.delete('logId123')
```

### 2. Custom Queries

```typescript
// Find all food logs for a user
const userLogs = await foodLogRepo.findByUserId('user123')

// Find logs by meal type
const breakfastLogs = await foodLogRepo.findByMealType('user123', 'breakfast')

// Get logs within a date range
const startDate = new Date('2024-01-01')
const endDate = new Date('2024-01-31')
const monthlyLogs = await foodLogRepo.findByDateRange('user123', startDate, endDate)

// Calculate daily nutrition totals
const dailyTotals = await foodLogRepo.getTotalNutritionByDate('user123', new Date())
// Returns: { calories: 2000, protein: 150, carbs: 200, fat: 70 }
```

### 3. Pagination

```typescript
// Get paginated results
const page1 = await foodLogRepo.findPaginated(1, 10, {
  where: [{ field: 'userId', operator: '==', value: 'user123' }],
  orderBy: { field: 'loggedAt', direction: 'desc' },
})

// Result structure:
// {
//   data: FoodLog[],
//   total: 45,
//   hasMore: true,
//   page: 1,
//   limit: 10
// }
```

### 4. Batch Operations

```typescript
// Batch create multiple food logs
const logs = await foodLogRepo.batchCreate([
  {
    userId: 'user123',
    foodName: 'Oatmeal',
    mealType: 'breakfast',
    portion: '1 cup',
    nutrition: { calories: 150, protein: 5, carbs: 27, fat: 3 },
    loggedAt: new Date(),
  },
  {
    userId: 'user123',
    foodName: 'Banana',
    mealType: 'snack',
    portion: '1 medium',
    nutrition: { calories: 105, protein: 1, carbs: 27, fat: 0.4 },
    loggedAt: new Date(),
  },
])

// Batch delete
await foodLogRepo.batchDelete(['logId1', 'logId2', 'logId3'])
```

### 5. User Repository

```typescript
import { UserRepository } from '@/repositories/user.repository'

const userRepo = new UserRepository()

// Create user
const user = await userRepo.create({
  email: 'user@example.com',
  displayName: 'John Doe',
  role: 'user',
  isActive: true,
})

// Find by email
const foundUser = await userRepo.findByEmail('user@example.com')

// Update last login
await userRepo.updateLastLogin('userId123')

// Find by role
const admins = await userRepo.findByRole('admin')
```

### 6. Chat Message Repository

```typescript
import { ChatMessageRepository } from '@/repositories/chat-message.repository'

const chatRepo = new ChatMessageRepository()

// Create chat message
const message = await chatRepo.create({
  userId: 'user123',
  message: 'What should I eat for breakfast?',
  role: 'user',
})

// Get conversation history
const history = await chatRepo.getConversationHistory('user123', undefined, 20)
```

### 7. Controller Example

```typescript
import { Request, Response } from 'express'
import { FoodLogRepository } from '@/repositories/food-log.repository'
import { createFoodLogSchema } from '@/schemas/food-log.schema'

const foodLogRepo = new FoodLogRepository()

export const createFoodLog = async (req: Request, res: Response) => {
  try {
    // Validate with Zod
    const validatedData = createFoodLogSchema.parse(req.body)

    // Create in Firestore
    const foodLog = await foodLogRepo.create(validatedData)

    res.status(201).json({
      success: true,
      data: foodLog,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      })
    }
  }
}
```

## API Endpoints

Here's an example of API endpoints using the food log repository:

```typescript
// POST /api/food-logs - Create food log
{
  "userId": "user123",
  "foodName": "Grilled Salmon",
  "mealType": "dinner",
  "portion": "200g",
  "nutrition": {
    "calories": 412,
    "protein": 46,
    "carbs": 0,
    "fat": 24
  },
  "loggedAt": "2024-01-15T18:30:00Z"
}

// GET /api/food-logs/user/:userId - Get all logs for user
// GET /api/food-logs/guest/:guestId - Get all logs for guest
// GET /api/food-logs/user/:userId/date-range?startDate=2024-01-01&endDate=2024-01-31
// GET /api/food-logs/user/:userId/summary?date=2024-01-15
// PUT /api/food-logs/:id - Update food log
// DELETE /api/food-logs/:id - Delete food log
```

## Adding New Collections

To add a new collection:

1. **Create schema** in `src/schemas/your-collection.schema.ts`:

```typescript
import { z } from 'zod/v4'
import { baseDocumentSchema, timestampSchema } from './base.schema'

export const yourCollectionSchema = z
  .object({
    // Your fields here
    name: z.string(),
  })
  .merge(baseDocumentSchema)
  .merge(timestampSchema)

export type YourCollection = z.infer<typeof yourCollectionSchema>
```

2. **Create repository** in `src/repositories/your-collection.repository.ts`:

```typescript
import { BaseRepository } from './base.repository'
import { YourCollection, yourCollectionSchema } from '@/schemas/your-collection.schema'

export class YourCollectionRepository extends BaseRepository<YourCollection> {
  constructor() {
    super('your_collection', yourCollectionSchema)
  }

  // Add custom methods here
}
```

3. **Export** in index files and use in controllers!

## Benefits

- ✅ **Type Safety**: Full TypeScript support with automatic type inference
- ✅ **Validation**: Automatic data validation using Zod schemas
- ✅ **Clean Code**: Repository pattern separates data access logic
- ✅ **Reusable**: Base repository provides common CRUD operations
- ✅ **Scalable**: Easy to add new collections and custom methods
- ✅ **Error Handling**: Consistent error handling across all operations
