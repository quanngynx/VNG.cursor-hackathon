'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@/contexts/UserContext'
import { foodLogApi } from '@/lib/api'
import { DailySummary, FoodHistoryItem } from '@/types/api'
import { CalorieProgress } from '@/components/CalorieProgress'
import { NutriChart } from '@/components/NutriChart'
import { FoodHistoryList } from '@/components/FoodHistoryList'
import { Loader2, Plus, LogOut, LogIn } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { Button } from '@/components/ui/button'
import { EditFoodDialog } from '@/components/EditFoodDialog'
import { AddFoodDialog } from '@/components/AddFoodDialog'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { user, guestId, isLoading: userLoading, login, logout } = useUser()
  const [summary, setSummary] = useState<DailySummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  
  // Dialog states
  const [editingItem, setEditingItem] = useState<FoodHistoryItem | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const fetchSummary = useCallback(async () => {
    if ((!user && !guestId) || userLoading) return

    setIsLoading(true)
    try {
      const id = user ? user.uid : guestId!
      const response = await foodLogApi.getSummary(id, date, !user)
      if (response.success && response.data) {
        setSummary(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setIsLoading(false)
    }
  }, [user, guestId, date, userLoading])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  const handleUpdate = async (id: string, data: any) => {
    try {
      await foodLogApi.update(id, data)
      toast.success('Cập nhật thành công')
      fetchSummary()
    } catch (error) {
      console.error('Update failed:', error)
      toast.error('Cập nhật thất bại')
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await foodLogApi.delete(id)
      toast.success('Xóa thành công')
      fetchSummary()
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error('Xóa thất bại')
      throw error
    }
  }

  const handleAdd = async (data: any) => {
    try {
      await foodLogApi.create({
        ...data,
        guestId: user ? undefined : guestId!,
        userId: user ? user.uid : (guestId || 'guest'), // Fallback for schema validation
        loggedAt: new Date(),
      })
      toast.success('Thêm món ăn thành công')
      fetchSummary()
    } catch (error) {
      console.error('Add failed:', error)
      toast.error('Thêm thất bại')
      throw error
    }
  }

  const handleLogin = async () => {
    try {
      await login()
      toast.success('Đăng nhập thành công')
    } catch (error) {
      toast.error('Đăng nhập thất bại')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Đã đăng xuất')
    } catch (error) {
      toast.error('Đăng xuất thất bại')
    }
  }

  if (userLoading) {
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
      <header className="bg-white dark:bg-gray-800 border-b px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          {user ? (
             <p className="text-xs text-gray-500 truncate max-w-[150px]">
               {user.displayName || user.email}
             </p>
          ) : (
             <p className="text-xs text-gray-500">Guest Mode</p>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm border rounded px-2 py-1.5 bg-transparent dark:border-gray-600"
          />
          {user ? (
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Đăng xuất">
              <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={handleLogin} title="Đăng nhập với Google">
              <LogIn className="h-5 w-5" />
            </Button>
          )}
        </div>
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
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Nhật ký ăn uống</h2>
            <Button size="sm" onClick={() => setIsAddOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Thêm món
            </Button>
          </div>
          
          <FoodHistoryList 
            items={summary?.history || []} 
            onEdit={setEditingItem}
          />
        </div>
      </div>

      <BottomNav />

      <EditFoodDialog
        item={editingItem}
        open={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleUpdate}
        onDelete={handleDelete}
      />

      <AddFoodDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  )
}
