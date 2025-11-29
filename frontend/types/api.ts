// API Types matching backend schemas

export interface FoodSuggestion {
  id: string
  name: string
  calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  description: string
  category: 'noodle' | 'rice' | 'soup' | 'salad' | 'fastfood' | 'drink' | 'other'
  ingredients?: string[]
  image_prompt?: string
  image?: string
}

export interface ChatResponse {
  reply: string
  suggestions: FoodSuggestion[]
}

export interface ChatRequest {
  guestId: string
  userId?: string
  message: string
}

export interface DailySummary {
  totalCalories: number
  totalMacros: {
    protein: number
    carbs: number
    fat: number
  }
  history: FoodHistoryItem[]
}

export interface FoodHistoryItem {
  id: string
  foodName: string
  calories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  timestamp: string | Date
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

export interface CreateFoodLogRequest {
  userId?: string
  guestId: string
  foodName: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  portion: string
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  loggedAt?: string | Date
  notes?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  details?: unknown
}

export interface UserHealthData {
  height?: number // in cm
  weight?: number // in kg
  birthDate?: string | Date
  gender?: 'male' | 'female' | 'other'
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
}

export interface UpdateUserHealthRequest {
  height?: number
  weight?: number
  birthDate?: string | Date
  gender?: 'male' | 'female' | 'other'
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
}

// Cooking Guide Types
export interface CookingStep {
  step: number
  title: string
  description: string
  duration?: string
  tips?: string
  image_prompt: string
  image?: string
}

export interface CookingIngredient {
  name: string
  amount: string
}

export interface CookingGuide {
  id: string
  guestId?: string
  userId?: string
  dishName: string
  servings: number
  totalTime: string
  difficulty: 'easy' | 'medium' | 'hard'
  ingredients: CookingIngredient[]
  steps: CookingStep[]
  chefTips?: string[]
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface CookingGuideRequest {
  guestId?: string
  userId?: string
  dishName: string
  language?: string
}

