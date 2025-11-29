'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import type { FoodSuggestion } from '@/types/api'
import { FoodImage } from './FoodImage'
import { chatApi } from '@/lib/api'
import { useUser } from '@/contexts/UserContext'

interface FoodDetailModalProps {
  food: FoodSuggestion | null
  open: boolean
  onClose: () => void
  onEat: (food: FoodSuggestion) => void
  isLoading?: boolean
}

export function FoodDetailModal({
  food,
  open,
  onClose,
  onEat,
  isLoading,
}: FoodDetailModalProps) {
  const router = useRouter()
  const { guestId, user } = useUser()
  const [isLoadingGuide, setIsLoadingGuide] = useState(false)

  if (!food) return null

  const handleEat = () => {
    onEat(food)
  }

  const handleShowCookingGuide = async () => {
    setIsLoadingGuide(true)

    try {
      // Don't hardcode language - let AI auto-detect from dish name
      const response = await chatApi.getCookingGuide({
        guestId: guestId || undefined,
        userId: user?.uid,
        dishName: food.name,
      })

      if (response.success && response.data?.id) {
        // Close modal and navigate to cooking guide page
        onClose()
        router.push(`/cooking-guide/${response.data.id}`)
      }
    } catch (error) {
      console.error('Failed to fetch cooking guide:', error)
    } finally {
      setIsLoadingGuide(false)
    }
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
          <div className="w-full h-48 rounded-lg overflow-hidden">
            <FoodImage food={food} className="w-full h-full" />
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

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleShowCookingGuide}
              disabled={isLoadingGuide}
              variant="outline"
              className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              size="lg"
            >
              {isLoadingGuide ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span> Đang tạo hướng dẫn...
                </span>
              ) : (
                '👨‍🍳 Hướng dẫn nấu ăn'
              )}
            </Button>
            <Button
              onClick={handleEat}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Đang lưu...' : 'Ăn món này'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

