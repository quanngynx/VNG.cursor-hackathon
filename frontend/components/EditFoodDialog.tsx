'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog'
import { Button } from './ui/button'
import { FoodHistoryItem } from '@/types/api'

interface EditFoodDialogProps {
  item: FoodHistoryItem | null
  open: boolean
  onClose: () => void
  onSave: (id: string, data: any) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function EditFoodDialog({
  item,
  open,
  onClose,
  onSave,
  onDelete,
}: EditFoodDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    foodName: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    portion: '1 serving',
  })

  useEffect(() => {
    if (item) {
      setFormData({
        foodName: item.foodName,
        calories: item.calories,
        protein: item.macros?.protein || 0,
        carbs: item.macros?.carbs || 0,
        fat: item.macros?.fat || 0,
        portion: '1 serving', // Default as we don't have it in history yet
      })
    }
  }, [item])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item) return

    setIsLoading(true)
    try {
      await onSave(item.id, {
        foodName: formData.foodName,
        nutrition: {
          calories: Number(formData.calories),
          protein: Number(formData.protein),
          carbs: Number(formData.carbs),
          fat: Number(formData.fat),
        },
        portion: formData.portion,
      })
      onClose()
    } catch (error) {
      console.error('Failed to update food log:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!item || !confirm('Bạn có chắc muốn xóa món này không?')) return

    setIsLoading(true)
    try {
      await onDelete(item.id)
      onClose()
    } catch (error) {
      console.error('Failed to delete food log:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa món ăn</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin dinh dưỡng hoặc xóa món ăn này
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Tên món</label>
            <input
              type="text"
              value={formData.foodName}
              onChange={(e) =>
                setFormData({ ...formData, foodName: e.target.value })
              }
              className="w-full p-2 border rounded-md bg-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Calories</label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) =>
                  setFormData({ ...formData, calories: Number(e.target.value) })
                }
                className="w-full p-2 border rounded-md bg-transparent"
                required
                min="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Portion</label>
              <input
                type="text"
                value={formData.portion}
                onChange={(e) =>
                  setFormData({ ...formData, portion: e.target.value })
                }
                className="w-full p-2 border rounded-md bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs font-medium mb-1 block text-blue-600">
                Protein (g)
              </label>
              <input
                type="number"
                value={formData.protein}
                onChange={(e) =>
                  setFormData({ ...formData, protein: Number(e.target.value) })
                }
                className="w-full p-2 border rounded-md bg-transparent text-sm"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block text-green-600">
                Carbs (g)
              </label>
              <input
                type="number"
                value={formData.carbs}
                onChange={(e) =>
                  setFormData({ ...formData, carbs: Number(e.target.value) })
                }
                className="w-full p-2 border rounded-md bg-transparent text-sm"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block text-purple-600">
                Fat (g)
              </label>
              <input
                type="number"
                value={formData.fat}
                onChange={(e) =>
                  setFormData({ ...formData, fat: Number(e.target.value) })
                }
                className="w-full p-2 border rounded-md bg-transparent text-sm"
                min="0"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              Xóa
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                Lưu thay đổi
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

