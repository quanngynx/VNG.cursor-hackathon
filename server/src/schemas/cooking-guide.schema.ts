import { z } from 'zod/v4'
import { baseDocumentSchema, timestampSchema } from './base.schema'

// Cooking step schema
export const cookingStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  description: z.string(),
  duration: z.string().optional(),
  tips: z.string().optional(),
  image_prompt: z.string(),
  image: z.string().optional(),
})

// Cooking ingredient schema
export const cookingIngredientSchema = z.object({
  name: z.string(),
  amount: z.string(),
})

// Cooking guide schema for database
export const cookingGuideSchema = z
  .object({
    guestId: z.string().optional(),
    userId: z.string().optional(),
    dishName: z.string(),
    servings: z.number(),
    totalTime: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    ingredients: z.array(cookingIngredientSchema),
    steps: z.array(cookingStepSchema),
    chefTips: z.array(z.string()).optional(),
  })
  .extend(baseDocumentSchema.shape)
  .extend(timestampSchema.shape)

// Schema for creating a new cooking guide
export const createCookingGuideSchema = z.object({
  guestId: z.string().optional(),
  userId: z.string().optional(),
  dishName: z.string(),
  servings: z.number(),
  totalTime: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  ingredients: z.array(cookingIngredientSchema),
  steps: z.array(cookingStepSchema),
  chefTips: z.array(z.string()).optional(),
})

// Infer types from schemas
export type CookingStep = z.infer<typeof cookingStepSchema>
export type CookingIngredient = z.infer<typeof cookingIngredientSchema>
export type CookingGuide = z.infer<typeof cookingGuideSchema>
export type CreateCookingGuideInput = z.infer<typeof createCookingGuideSchema>

