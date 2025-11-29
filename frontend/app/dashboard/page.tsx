'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { foodLogApi, userApi } from '@/lib/api'
import { DailySummary, FoodHistoryItem } from '@/types/api'
import { CalorieProgress } from '@/components/CalorieProgress'
import { NutriChart } from '@/components/NutriChart'
import { FoodHistoryList } from '@/components/FoodHistoryList'
import { Calendar } from '@/components/Calendar'
import { HealthMetrics } from '@/components/HealthMetrics'
import { HealthMetricsDialog } from '@/components/HealthMetricsDialog'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Loader2, Plus, LogOut, LogIn, Share2, Calendar as CalendarIcon } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { Button } from '@/components/ui/button'
import { EditFoodDialog } from '@/components/EditFoodDialog'
import { AddFoodDialog } from '@/components/AddFoodDialog'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { user, guestId, isLoading: userLoading, login, logout } = useUser()
  const { t } = useLanguage()
  const [summary, setSummary] = useState<DailySummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [showCalendar, setShowCalendar] = useState(false)
  
  // Health metrics
  const [height, setHeight] = useState<number | undefined>(undefined)
  const [weight, setWeight] = useState<number | undefined>(undefined)
  const [gender, setGender] = useState<'male' | 'female' | 'other' | undefined>(undefined)
  const [isLoadingHealth, setIsLoadingHealth] = useState(true)
  const [isHealthDialogOpen, setIsHealthDialogOpen] = useState(false)
  
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
      toast.error(t.dashboard.cannotLoadData)
    } finally {
      setIsLoading(false)
    }
  }, [user, guestId, date, userLoading])

  const fetchHealthData = useCallback(async () => {
    if ((!user && !guestId) || userLoading) return

    setIsLoadingHealth(true)
    try {
      const id = user ? user.uid : guestId!
      const response = await userApi.getHealthData(id, !user)
      if (response.success && response.data) {
        setHeight(response.data.height)
        setWeight(response.data.weight)
        setGender(response.data.gender)
      }
    } catch (error) {
      console.error('Failed to fetch health data:', error)
    } finally {
      setIsLoadingHealth(false)
    }
  }, [user, guestId, userLoading])

  useEffect(() => {
    fetchSummary()
    fetchHealthData()
  }, [fetchSummary, fetchHealthData])

  const handleUpdate = async (id: string, data: any) => {
    try {
      await foodLogApi.update(id, data)
      toast.success(t.dashboard.updateSuccess)
      fetchSummary()
    } catch (error) {
      console.error('Update failed:', error)
      toast.error(t.dashboard.updateFailed)
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await foodLogApi.delete(id)
      toast.success(t.dashboard.deleteSuccess)
      fetchSummary()
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error(t.dashboard.deleteFailed)
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
      toast.success(t.dashboard.addSuccess)
      fetchSummary()
    } catch (error) {
      console.error('Add failed:', error)
      toast.error(t.dashboard.addFailed)
      throw error
    }
  }

  const handleShare = async () => {
    const id = user ? user.uid : guestId
    if (!id) return
    
    const shareUrl = `${window.location.origin}/share/${id}`
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success(t.dashboard.shareLinkCopied)
    } catch (err) {
      toast.error(t.dashboard.cannotCopyLink)
    }
  }

  const handleLogin = async () => {
    try {
      await login()
      toast.success(t.dashboard.loginSuccess)
    } catch (error) {
      toast.error(t.dashboard.loginFailed)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success(t.dashboard.logoutSuccess)
    } catch (error) {
      toast.error(t.dashboard.logoutFailed)
    }
  }

  const handleSaveHealthData = async (data: { height: number; weight: number; gender?: 'male' | 'female' | 'other' }) => {
    try {
      const id = user ? user.uid : guestId!
      const response = await userApi.updateHealthData(id, data, !user)
      if (response.success && response.data) {
        setHeight(response.data.height)
        setWeight(response.data.weight)
        setGender(response.data.gender)
        toast.success(t.health.updateSuccess)
      } else {
        throw new Error(response.error || 'Failed to update health data')
      }
    } catch (error) {
      console.error('Failed to save health data:', error)
      toast.error(t.health.updateFailed)
      throw error
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
  // Calculate target calories based on gender: male = 3000, female = 2000
  const targetCalories = gender === 'male' ? 3000 : gender === 'female' ? 2000 : 2000

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold">{t.header.dashboard}</h1>
          {user ? (
             <p className="text-xs text-gray-500 truncate max-w-[150px]">
               {user.displayName || user.email}
             </p>
          ) : (
             <p className="text-xs text-gray-500">{t.header.guestMode}</p>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowCalendar(!showCalendar)}
            title={t.header.selectDate}
            className={showCalendar ? 'bg-orange-100 dark:bg-orange-900/30' : ''}
          >
            <CalendarIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleShare} title={t.header.shareProfile}>
            <Share2 className="h-5 w-5 text-orange-500" />
          </Button>
          {user ? (
            <Button variant="ghost" size="icon" onClick={handleLogout} title={t.header.logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={handleLogin} title={t.header.loginWithGoogle}>
              <LogIn className="h-5 w-5" />
            </Button>
          )}
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Calendar */}
        {showCalendar && (
          <Calendar selectedDate={date} onDateSelect={(newDate) => {
            setDate(newDate)
            setShowCalendar(false)
          }} />
        )}

        {/* Health Metrics */}
        <HealthMetrics
          height={height}
          weight={weight}
          gender={gender}
          onEdit={() => setIsHealthDialogOpen(true)}
        />

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
            <h2 className="text-lg font-semibold">{t.dashboard.foodLog}</h2>
            <Button size="sm" onClick={() => setIsAddOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> {t.dashboard.addFood}
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

      <HealthMetricsDialog
        open={isHealthDialogOpen}
        onClose={() => setIsHealthDialogOpen(false)}
        onSave={handleSaveHealthData}
        initialHeight={height}
        initialWeight={weight}
        initialGender={gender}
      />
    </div>
  )
}
