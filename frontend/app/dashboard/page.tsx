'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { 
  useDailySummary, 
  useHealthData, 
  useUpdateHealthData,
  useCreateFoodLog,
  useUpdateFoodLog,
  useDeleteFoodLog
} from '@/hooks/useQueries'
import { FoodHistoryItem, CreateFoodLogRequest } from '@/types/api'
import { CalorieProgress } from '@/components/CalorieProgress'
import { NutriChart } from '@/components/NutriChart'
import { FoodHistoryList } from '@/components/FoodHistoryList'
import { Calendar } from '@/components/Calendar'
import { HealthMetrics } from '@/components/HealthMetrics'
import { HealthMetricsDialog } from '@/components/HealthMetricsDialog'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Loader2, Plus, LogOut, LogIn, Share2, Calendar as CalendarIcon, RefreshCw } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { Button } from '@/components/ui/button'
import { EditFoodDialog } from '@/components/EditFoodDialog'
import { AddFoodDialog } from '@/components/AddFoodDialog'
import { toast } from 'sonner'

export default function DashboardPage() {
  const { user, guestId, isLoading: userLoading, login, logout } = useUser()
  const { t } = useLanguage()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [showCalendar, setShowCalendar] = useState(false)
  const [isHealthDialogOpen, setIsHealthDialogOpen] = useState(false)
  
  // Dialog states
  const [editingItem, setEditingItem] = useState<FoodHistoryItem | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  // Cached queries - data persists across navigation!
  const { 
    data: summary, 
    isLoading: isSummaryLoading,
    isFetching: isSummaryFetching,
    refetch: refetchSummary
  } = useDailySummary(date)
  
  const { 
    data: healthData, 
    isLoading: isHealthLoading 
  } = useHealthData()
  
  // Mutations
  const updateHealthMutation = useUpdateHealthData()
  const createFoodMutation = useCreateFoodLog()
  const updateFoodMutation = useUpdateFoodLog()
  const deleteFoodMutation = useDeleteFoodLog()

  const handleUpdate = async (id: string, data: Partial<CreateFoodLogRequest>) => {
    try {
      await updateFoodMutation.mutateAsync({ logId: id, data })
      toast.success(t.dashboard.updateSuccess)
    } catch (error) {
      console.error('Update failed:', error)
      toast.error(t.dashboard.updateFailed)
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteFoodMutation.mutateAsync(id)
      toast.success(t.dashboard.deleteSuccess)
    } catch (error) {
      console.error('Delete failed:', error)
      toast.error(t.dashboard.deleteFailed)
      throw error
    }
  }

  const handleAdd = async (data: Omit<CreateFoodLogRequest, 'userId' | 'guestId'>) => {
    try {
      await createFoodMutation.mutateAsync({
        ...data,
        loggedAt: new Date(),
      })
      toast.success(t.dashboard.addSuccess)
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
      await updateHealthMutation.mutateAsync(data)
      toast.success(t.health.updateSuccess)
    } catch (error) {
      console.error('Failed to save health data:', error)
      toast.error(t.health.updateFailed)
      throw error
    }
  }

  // Show loading only on initial load, not when refetching in background
  if (userLoading || (isSummaryLoading && !summary)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const totalCalories = summary?.totalCalories || 0
  // Calculate target calories based on gender: male = 3000, female = 2000
  const gender = healthData?.gender
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
          height={healthData?.height}
          weight={healthData?.weight}
          gender={healthData?.gender}
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
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{t.dashboard.foodLog}</h2>
              {/* Background refetch indicator */}
              {isSummaryFetching && (
                <RefreshCw className="h-4 w-4 animate-spin text-orange-500" />
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => refetchSummary()}
                disabled={isSummaryFetching}
              >
                <RefreshCw className={`h-4 w-4 ${isSummaryFetching ? 'animate-spin' : ''}`} />
              </Button>
              <Button size="sm" onClick={() => setIsAddOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> {t.dashboard.addFood}
              </Button>
            </div>
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
        initialHeight={healthData?.height}
        initialWeight={healthData?.weight}
        initialGender={healthData?.gender}
      />
    </div>
  )
}
