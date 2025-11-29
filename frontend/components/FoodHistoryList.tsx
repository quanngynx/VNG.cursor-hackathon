'use client'

import { FoodHistoryItem } from '@/types/api'
import { Card } from './ui/card'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface FoodHistoryListProps {
  items: FoodHistoryItem[]
}

export function FoodHistoryList({ items }: FoodHistoryListProps) {
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
              className="flex justify-between items-center py-2 border-b last:border-0"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{item.foodName}</p>
                <p className="text-xs text-gray-500">{timeStr}</p>
              </div>
              <p className="text-sm font-semibold text-orange-600">
                {item.calories} kcal
              </p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

