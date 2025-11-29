'use client'

import { Progress } from './ui/progress'
import { Card } from './ui/card'

interface CalorieProgressProps {
  current: number
  target: number
}

export function CalorieProgress({ current, target }: CalorieProgressProps) {
  const percentage = Math.min((current / target) * 100, 100)

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-3">Calories</h2>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Đã tiêu thụ
          </span>
          <span className="font-semibold">
            {current} / {target} kcal
          </span>
        </div>
        <Progress value={percentage} className="h-3" />
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Còn lại: {Math.max(0, target - current)} kcal
        </p>
      </div>
    </Card>
  )
}

