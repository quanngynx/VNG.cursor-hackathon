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

