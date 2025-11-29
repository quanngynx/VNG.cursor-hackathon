'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/contexts/UserContext'
import { foodLogApi } from '@/lib/api'
import { DailySummary } from '@/types/api'
import { CalorieProgress } from '@/components/CalorieProgress'
import { NutriChart } from '@/components/NutriChart'
import { FoodHistoryList } from '@/components/FoodHistoryList'
import { Loader2 } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'

export default function DashboardPage() {
  const { guestId, isLoading: userLoading } = useUser()
  const [summary, setSummary] = useState<DailySummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (!guestId || userLoading) return

    const fetchSummary = async () => {
      setIsLoading(true)
      try {
        const response = await foodLogApi.getSummary(guestId, date)
        if (response.success && response.data) {
          setSummary(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch summary:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [guestId, date, userLoading])

  if (userLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const totalCalories = summary?.totalCalories || 0
  const targetCalories = 2000

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b px-4 py-3">
        <h1 className="text-xl font-bold">Your Daily Tracker</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-2 text-sm border rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600"
        />
      </header>

      <div className="px-4 py-6 space-y-6">
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
        <FoodHistoryList items={summary?.history || []} />
      </div>

      <BottomNav />
    </div>
  )
}

