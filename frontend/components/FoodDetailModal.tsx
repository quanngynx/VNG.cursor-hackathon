'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { FoodSuggestion } from '@/types/api'

interface FoodDetailModalProps {
  food: FoodSuggestion | null
  open: boolean
  onClose: () => void
  onEat: (food: FoodSuggestion) => void
  isLoading?: boolean
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

export function FoodDetailModal({
  food,
  open,
  onClose,
  onEat,
  isLoading,
}: FoodDetailModalProps) {
  if (!food) return null

  const imageSrc = categoryImageMap[food.category] || categoryImageMap.other

  const handleEat = () => {
    onEat(food)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{food.name}</DialogTitle>
          <DialogDescription>{food.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
            <img
              src={imageSrc}
              alt={food.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/images/default.png'
              }}
            />
          </div>

          {/* Nutrition Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {food.calories}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Calories
              </div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {food.macros.protein}g
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Protein
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {food.macros.carbs}g
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Carbs
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {food.macros.fat}g
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Fat
              </div>
            </div>
          </div>

          {/* Ingredients */}
          {food.ingredients && food.ingredients.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Nguyên liệu chính:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                {food.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={handleEat}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Đang lưu...' : 'Ăn món này'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

