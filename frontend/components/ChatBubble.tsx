'use client'

import { FoodSuggestion } from '@/types/api'
import { FoodCard } from './FoodCard'
import { Bot, User } from 'lucide-react'

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
      className={`flex w-full gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4 ${
        isUser ? 'animate-slide-in-right' : 'animate-slide-in-left'
      }`}
    >
      {/* Avatar for bot */}
      {!isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20 animate-scale-in">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-gradient-primary text-white rounded-br-md'
            : 'glass border border-border/50 rounded-bl-md'
        }`}
      >
        <p className={`text-sm whitespace-pre-wrap leading-relaxed ${
          isUser ? 'text-white' : 'text-foreground'
        }`}>
          {message}
        </p>
        
        {!isUser && suggestions && suggestions.length > 0 && (
          <div className="mt-4 space-y-2">
            {suggestions.map((food, index) => (
              <div
                key={food.id}
                className={`animate-slide-up stagger-${Math.min(index + 1, 5)}`}
                style={{ opacity: 0 }}
              >
                <FoodCard
                  food={food}
                  onClick={() => onFoodClick?.(food)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center border border-border/50 animate-scale-in">
          <User className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
    </div>
  )
}

// Loading bubble with typing animation
export function TypingIndicator() {
  return (
    <div className="flex w-full gap-3 justify-start mb-4 animate-fade-in">
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="glass border border-border/50 rounded-2xl rounded-bl-md px-5 py-4">
        <div className="flex gap-1.5">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  )
}
