'use client'

import { FoodSuggestion } from '@/types/api'
import { FoodCard } from './FoodCard'

interface ChatBubbleProps {
  message: string
  isUser: boolean
  suggestions?: FoodSuggestion[]
  onFoodClick?: (food: FoodSuggestion) => void
}

export function ChatBubble({
  message,
  isUser,
  suggestions,
  onFoodClick,
}: ChatBubbleProps) {
  return (
    <div
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message}</p>
        {!isUser && suggestions && suggestions.length > 0 && (
          <div className="mt-3 space-y-2">
            {suggestions.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onClick={() => onFoodClick?.(food)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

