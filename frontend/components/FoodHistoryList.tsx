'use client'

import { FoodHistoryItem } from '@/types/api'
import { Card } from './ui/card'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Pencil } from 'lucide-react'
import { Button } from './ui/button'

interface FoodHistoryListProps {
  items: FoodHistoryItem[]
  onEdit?: (item: FoodHistoryItem) => void
}

export function FoodHistoryList({ items, onEdit }: FoodHistoryListProps) {
  if (items.length === 0) {
    return (
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-3">History</h2>
        <p className="text-sm text-gray-500 text-center py-4">
          Chưa có món ăn nào được ghi lại hôm nay
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-3">History</h2>
      <div className="space-y-2">
        {items.map((item) => {
          const timestamp = new Date(item.timestamp)
          const timeStr = format(timestamp, 'HH:mm', { locale: vi })

          return (
            <div
              key={item.id}
              className="flex justify-between items-center py-2 border-b last:border-0 group"
            >
              <div className="flex-1 min-w-0 mr-4">
                <p className="font-medium text-sm truncate">{item.foodName}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{timeStr}</span>
                  <span>•</span>
                  <span className="capitalize">{item.mealType}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-orange-600 whitespace-nowrap">
                  {item.calories} kcal
                </p>
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
