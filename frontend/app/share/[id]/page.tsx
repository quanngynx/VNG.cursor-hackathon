'use client'

import { useState, useEffect, use } from 'react'
import { foodLogApi } from '@/lib/api'
import { DailySummary } from '@/types/api'
import { CalorieProgress } from '@/components/CalorieProgress'
import { NutriChart } from '@/components/NutriChart'
import { FoodHistoryList } from '@/components/FoodHistoryList'
import { Loader2, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SharedPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [summary, setSummary] = useState<DailySummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true)
      try {
        // Detect if ID is guest or user based on prefix 'guest-'
        const isGuest = resolvedParams.id.startsWith('guest-')
        
        const response = await foodLogApi.getSummary(
          resolvedParams.id, 
          date,
          isGuest
        )
        
        if (response.success && response.data) {
          setSummary(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch shared summary:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [resolvedParams.id, date])

  const totalCalories = summary?.totalCalories || 0
  const targetCalories = 2000

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-50/30 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
             <h1 className="text-xl font-bold text-orange-600">Nutrition Tracker</h1>
             <p className="text-xs text-gray-500">Đang xem chế độ ăn của người thương ❤️</p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <Home className="w-4 h-4" />
              Trang chủ
            </Button>
          </Link>
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full text-sm border rounded-lg px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-orange-200"
        />
      </header>

      <div className="px-4 py-6 space-y-6 max-w-md mx-auto">
        {/* Calorie Progress */}
        <CalorieProgress
          current={totalCalories}
          target={targetCalories}
        />

        {/* Macro Chart */}
        {summary && (
          <NutriChart
            protein={summary.totalMacros.protein}
            carbs={summary.totalMacros.carbs}
            fat={summary.totalMacros.fat}
          />
        )}

        {/* History List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Nhật ký ăn uống
          </h2>
          <FoodHistoryList items={summary?.history || []} />
        </div>
      </div>
    </div>
  )
}

