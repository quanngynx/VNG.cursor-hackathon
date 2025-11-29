'use client'

import { FoodSuggestion } from '@/types/api'
import { Card } from './ui/card'

interface FoodCardProps {
  food: FoodSuggestion
  onClick?: () => void
}

const categoryImageMap: Record<string, string> = {
  noodle: '/images/noodle.png',
  rice: '/images/rice.png',
  soup: '/images/soup.png',
  salad: '/images/salad.png',
  fastfood: '/images/fastfood.png',
  drink: '/images/drink.png',
  other: '/images/default.png',
}

export function FoodCard({ food, onClick }: FoodCardProps) {
  const imageSrc = categoryImageMap[food.category] || categoryImageMap.other

  return (
    <Card
      className="p-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex gap-3">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-700">
          <img
            src={imageSrc}
            alt={food.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to default if image fails
              const target = e.target as HTMLImageElement
              target.src = '/images/default.png'
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{food.name}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {food.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium text-orange-600">
              {food.calories} kcal
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}

