import { z } from 'zod/v4';
import { baseDocumentSchema, timestampSchema } from './base.schema';

// Nutrition schema
export const nutritionSchema = z.object({
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  fiber: z.number().min(0).optional(),
  sugar: z.number().min(0).optional(),
});

// Food log schema
export const foodLogSchema = z
  .object({
    userId: z.string(),
    guestId: z.string().optional(),
    foodName: z.string().min(1).max(200),
    mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
    portion: z.string(),
    nutrition: nutritionSchema,
    loggedAt: z.date().or(z.string()),
    notes: z.string().optional(),
  })
  .extend(baseDocumentSchema.shape)
  .extend(timestampSchema.shape);

// Schema for creating a new food log
export const createFoodLogSchema = z.object({
  userId: z.string(),
  guestId: z.string().optional(),
  foodName: z.string().min(1).max(200),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  portion: z.string(),
  nutrition: nutritionSchema,
  loggedAt: z.date().or(z.string()),
  notes: z.string().optional(),
});

// Schema for updating a food log
export const updateFoodLogSchema = createFoodLogSchema.partial();

// Infer types from schemas
export type FoodLog = z.infer<typeof foodLogSchema>;
export type CreateFoodLogInput = z.infer<typeof createFoodLogSchema>;
export type UpdateFoodLogInput = z.infer<typeof updateFoodLogSchema>;
export type Nutrition = z.infer<typeof nutritionSchema>;
