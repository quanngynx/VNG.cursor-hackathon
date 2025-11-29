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
import { useLanguage } from '@/contexts/LanguageContext'
import { Flame, ChefHat, Utensils, Loader2, Sparkles } from 'lucide-react'

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
  const { t } = useLanguage()
  const [isLoadingGuide, setIsLoadingGuide] = useState(false)

  if (!food) return null

  const handleEat = () => {
    onEat(food)
  }

  const handleShowCookingGuide = async () => {
    setIsLoadingGuide(true)

    try {
      const response = await chatApi.getCookingGuide({
        guestId: guestId || undefined,
        userId: user?.uid,
        dishName: food.name,
      })

      if (response.success && response.data?.id) {
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
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-white dark:bg-gray-900">
        {/* Hero Image */}
        <div className="relative w-full h-56 overflow-hidden">
          <FoodImage food={food} className="w-full h-full object-cover" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Calorie badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-lg">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-bold text-foreground">{food.calories} kcal</span>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-bold text-gradient">{food.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground">{food.description}</DialogDescription>
          </DialogHeader>

          {/* Macros Grid */}
          <div className="grid grid-cols-3 gap-3">
            <MacroCard 
              label={t.food.protein}
              value={food.macros.protein}
              color="blue"
            />
            <MacroCard 
              label={t.food.carbs}
              value={food.macros.carbs}
              color="amber"
            />
            <MacroCard 
              label={t.food.fat}
              value={food.macros.fat}
              color="rose"
            />
          </div>

          {/* Ingredients */}
          {food.ingredients && food.ingredients.length > 0 && (
            <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                {t.food.ingredients}
              </h4>
              <div className="flex flex-wrap gap-2">
                {food.ingredients.map((ingredient, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-white dark:bg-gray-800 border border-border/50 text-muted-foreground"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleShowCookingGuide}
              disabled={isLoadingGuide}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              {isLoadingGuide ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ChefHat className="w-4 h-4 mr-2" />
                  Hướng dẫn nấu
                </>
              )}
            </Button>
            <Button
              onClick={handleEat}
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl bg-gradient-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Utensils className="w-4 h-4 mr-2" />
                  {t.food.eatThis}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function MacroCard({ 
  label, 
  value, 
  color 
}: { 
  label: string
  value: number
  color: 'blue' | 'amber' | 'rose'
}) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-100 dark:border-blue-900/50'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/50'
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/50'
    },
  }

  const styles = colorClasses[color]

  return (
    <div className={`text-center p-3 rounded-xl ${styles.bg} border ${styles.border} transition-all duration-300 hover:scale-105`}>
      <div className={`text-2xl font-bold ${styles.text}`}>
        {value}g
      </div>
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mt-0.5">
        {label}
      </div>
    </div>
  )
}
