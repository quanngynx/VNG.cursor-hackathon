'use client'

import { useState } from 'react'
import { FoodSuggestion } from '@/types/api'
import { Card } from './ui/card'
import { Utensils, Flame, ChevronRight } from 'lucide-react'

interface FoodCardProps {
  food: FoodSuggestion
  onClick?: () => void
}

export function FoodCard({ food, onClick }: FoodCardProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Use image_prompt from AI if available, otherwise fallback to food name
  const prompt = food.image_prompt || `${food.name} delicious Vietnamese food photography`
  const imageSrc = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=256&height=256&nologo=true&seed=${food.id}`

  return (
    <Card
      className="group p-0 cursor-pointer overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-border/50 card-hover"
      onClick={onClick}
    >
      <div className="flex gap-3 p-3">
        {/* Food Image */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-primary/5 to-primary/10">
          {/* Loading shimmer effect */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 animate-shimmer" />
          )}
          
          {!hasError ? (
            <img
              src={imageSrc}
              alt={food.name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
              } group-hover:scale-110`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setHasError(true)
                setIsLoading(false)
              }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <Utensils className="w-8 h-8 text-primary/40" />
            </div>
          )}

          {/* Calorie badge */}
          <div className="absolute bottom-1 left-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] font-semibold text-white">
              {food.calories}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {food.name}
            </h3>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
          
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
          
          {/* Macros */}
          <div className="flex items-center gap-3 mt-2">
            <MacroBadge label="P" value={food.macros.protein} color="blue" />
            <MacroBadge label="C" value={food.macros.carbs} color="amber" />
            <MacroBadge label="F" value={food.macros.fat} color="rose" />
          </div>
        </div>
      </div>

      {/* Hover accent line */}
      <div className="h-0.5 bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Card>
  )
}

function MacroBadge({ 
  label, 
  value, 
  color 
}: { 
  label: string
  value: number
  color: 'blue' | 'amber' | 'rose'
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400',
  }

  return (
    <div className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${colorClasses[color]}`}>
      {label}: {value}g
    </div>
  )
}
