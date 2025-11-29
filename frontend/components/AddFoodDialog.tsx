'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog'
import { Button } from './ui/button'

interface AddFoodDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (data: any) => Promise<void>
}

export function AddFoodDialog({ open, onClose, onAdd }: AddFoodDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    portion: '1 serving',
    mealType: 'breakfast',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onAdd({
        foodName: formData.foodName,
        nutrition: {
          calories: Number(formData.calories) || 0,
          protein: Number(formData.protein) || 0,
          carbs: Number(formData.carbs) || 0,
          fat: Number(formData.fat) || 0,
        },
        portion: formData.portion,
        mealType: formData.mealType,
      })
      // Reset form
      setFormData({
        foodName: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        portion: '1 serving',
        mealType: 'breakfast',
      })
      onClose()
    } catch (error) {
      console.error('Failed to add food log:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm món ăn thủ công</DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết món ăn bạn đã dùng
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
              placeholder="Ví dụ: Phở bò, Cơm tấm..."
              className="w-full p-2 border rounded-md bg-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Bữa ăn</label>
              <select
                value={formData.mealType}
                onChange={(e) =>
                  setFormData({ ...formData, mealType: e.target.value })
                }
                className="w-full p-2 border rounded-md bg-transparent"
              >
                <option value="breakfast">Bữa sáng</option>
                <option value="lunch">Bữa trưa</option>
                <option value="dinner">Bữa tối</option>
                <option value="snack">Ăn vặt</option>
              </select>
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

          <div>
            <label className="text-sm font-medium mb-1 block">Calories</label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) =>
                setFormData({ ...formData, calories: e.target.value })
              }
              className="w-full p-2 border rounded-md bg-transparent"
              required
              min="0"
            />
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
                  setFormData({ ...formData, protein: e.target.value })
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
                  setFormData({ ...formData, carbs: e.target.value })
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
                  setFormData({ ...formData, fat: e.target.value })
                }
                className="w-full p-2 border rounded-md bg-transparent text-sm"
                min="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              Thêm món
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

