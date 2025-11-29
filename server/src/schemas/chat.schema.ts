import { z } from 'zod/v4'

// Schema for chat request
export const chatRequestSchema = z.object({
  userId: z.string().optional(),
  guestId: z.string().min(1, 'guestId is required'),
  message: z.string().min(1, 'Message cannot be empty'),
})

// Schema for food suggestion (matching AI service response)
export const foodSuggestionSchema = z.object({
  id: z.string(),
  name: z.string(),
  calories: z.number(),
  macros: z.object({
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }),
  description: z.string(),
  category: z.enum(['noodle', 'rice', 'soup', 'salad', 'fastfood', 'drink', 'other']),
  ingredients: z.array(z.string()).optional(),
})

// Schema for chat response
export const chatResponseSchema = z.object({
  reply: z.string(),
  suggestions: z.array(foodSuggestionSchema).length(3),
})

// Infer types
export type ChatRequest = z.infer<typeof chatRequestSchema>
export type FoodSuggestion = z.infer<typeof foodSuggestionSchema>
export type ChatResponse = z.infer<typeof chatResponseSchema>

