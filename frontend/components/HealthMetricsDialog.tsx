'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { useLanguage } from '@/contexts/LanguageContext'

interface HealthMetricsDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: { height: number; weight: number; gender?: 'male' | 'female' | 'other' }) => Promise<void>
  initialHeight?: number
  initialWeight?: number
  initialGender?: 'male' | 'female' | 'other'
}

export function HealthMetricsDialog({
  open,
  onClose,
  onSave,
  initialHeight,
  initialWeight,
  initialGender,
}: HealthMetricsDialogProps) {
  const { t } = useLanguage()
  const [height, setHeight] = useState<string>(initialHeight?.toString() || '')
  const [weight, setWeight] = useState<string>(initialWeight?.toString() || '')
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>(initialGender || '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setHeight(initialHeight?.toString() || '')
      setWeight(initialWeight?.toString() || '')
      setGender(initialGender || '')
    }
  }, [open, initialHeight, initialWeight, initialGender])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const heightNum = parseFloat(height)
    const weightNum = parseFloat(weight)

    if (!heightNum || heightNum < 50 || heightNum > 250) {
      alert(t.health.heightRange)
      return
    }

    if (!weightNum || weightNum < 20 || weightNum > 300) {
      alert(t.health.weightRange)
      return
    }

    setIsSaving(true)
    try {
      await onSave({ 
        height: heightNum, 
        weight: weightNum,
        gender: gender ? (gender as 'male' | 'female' | 'other') : undefined
      })
      onClose()
    } catch (error) {
      console.error('Failed to save health metrics:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.health.updateInfo}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="height" className="text-sm font-medium">
              {t.health.height}
            </label>
            <input
              id="height"
              type="number"
              min="50"
              max="250"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-transparent dark:border-gray-600"
              placeholder="Ví dụ: 170"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="weight" className="text-sm font-medium">
              {t.health.weight}
            </label>
            <input
              id="weight"
              type="number"
              min="20"
              max="300"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg bg-transparent dark:border-gray-600"
              placeholder="Ví dụ: 65"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="gender" className="text-sm font-medium">
              {t.health.gender}
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other' | '')}
              className="w-full px-3 py-2 border rounded-lg bg-transparent dark:border-gray-600"
            >
              <option value="">{t.health.selectGender}</option>
              <option value="male">{t.health.male}</option>
              <option value="female">{t.health.female}</option>
              <option value="other">{t.health.other}</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? t.common.loading : t.common.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

