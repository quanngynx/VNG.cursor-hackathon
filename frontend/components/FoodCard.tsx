'use client'

import { FoodSuggestion } from '@/types/api'
import { Card } from './ui/card'
import { useState } from 'react'
import { Utensils } from 'lucide-react'

interface FoodCardProps {
  food: FoodSuggestion
  onClick?: () => void
}

export function FoodCard({ food, onClick }: FoodCardProps) {
  const [hasError, setHasError] = useState(false)

  // Use image_prompt from AI if available, otherwise fallback to food name
  // We append "delicious food" to ensure better quality generation
  const prompt = food.image_prompt || `${food.name} delicious food`
  const imageSrc = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=128&height=128&nologo=true&seed=${food.id}`

  return (
    <Card
      className="p-3 cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
      onClick={onClick}
    >
      <div className="flex gap-3">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          {!hasError ? (
            <img
              src={imageSrc}
              alt={food.name}
              className="w-full h-full object-cover"
              onError={() => setHasError(true)}
              loading="lazy"
            />
          ) : (
            <Utensils className="w-6 h-6 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate text-gray-900 dark:text-gray-100">
            {food.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {food.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
              {food.calories} kcal
            </span>
            {food.category && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">
                {food.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
