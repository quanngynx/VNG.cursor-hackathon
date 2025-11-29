'use client'

import { useState, useEffect } from 'react'
import { FoodSuggestion } from '@/types/api'
import { getFoodImageUrl } from '@/lib/image'
import { Loader2 } from 'lucide-react'

interface FoodImageProps {
  food: FoodSuggestion
  className?: string
  alt?: string
}

export function FoodImage({ food, className, alt }: FoodImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Use the same consistent image URL logic
  const imageSrc = getFoodImageUrl(food, { width: 512, height: 512 })

  useEffect(() => {
    // Reset state when src changes
    setIsLoading(true)
    setHasError(false)
  }, [imageSrc])

  return (
    <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-700 ${className}`}>
      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin mb-1" />
          <span className="text-[10px] text-orange-500 font-medium animate-pulse">
            Baking...
          </span>
        </div>
      )}

      {/* Image */}
      <img
        src={imageSrc}
        alt={alt || food.name}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => {
          setIsLoading(false)
        }}
        onError={(e) => {
          console.error('Image load failed:', imageSrc)
          setIsLoading(false)
          setHasError(true)
        }}
      />

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
          <span className="text-xl" role="img" aria-label="food">🍽️</span>
        </div>
      )}
    </div>
  )
}
