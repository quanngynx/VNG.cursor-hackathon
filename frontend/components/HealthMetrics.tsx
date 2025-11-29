'use client'

import { Card } from './ui/card'
import { Button } from './ui/button'
import { Edit2, Activity, Heart, Scale } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface HealthMetricsProps {
  height?: number // in cm
  weight?: number // in kg
  gender?: 'male' | 'female' | 'other'
  onEdit?: () => void
}

export function HealthMetrics({ height, weight, gender, onEdit }: HealthMetricsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { t } = useLanguage()

  // Calculate BMI
  const calculateBMI = (): number | null => {
    if (!height || !weight) return null
    const heightInMeters = height / 100
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
  }

  // Get BMI category
  const getBMICategory = (bmi: number): { 
    label: string
    color: string
    description: string
    bgColor: string
    iconColor: string
  } => {
    if (bmi < 18.5) {
      return {
        label: t.health.underweight,
        color: 'text-blue-600 dark:text-blue-400',
        description: t.health.needGainWeight,
        bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
        iconColor: 'text-blue-500',
      }
    } else if (bmi < 23) {
      return {
        label: t.health.normal,
        color: 'text-green-600 dark:text-green-400',
        description: t.health.weightGood,
        bgColor: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
        iconColor: 'text-green-500',
      }
    } else if (bmi < 25) {
      return {
        label: t.health.overweight,
        color: 'text-yellow-600 dark:text-yellow-400',
        description: t.health.shouldLoseWeight,
        bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20',
        iconColor: 'text-yellow-500',
      }
    } else if (bmi < 30) {
      return {
        label: t.health.obese1,
        color: 'text-orange-600 dark:text-orange-400',
        description: t.health.needLoseWeight,
        bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
        iconColor: 'text-orange-500',
      }
    } else {
      return {
        label: t.health.obese2,
        color: 'text-red-600 dark:text-red-400',
        description: t.health.needLoseWeight,
        bgColor: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
        iconColor: 'text-red-500',
      }
    }
  }

  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
  const calculateBMR = (): number | null => {
    if (!height || !weight) return null
    // Simplified calculation (assuming average age 30, male)
    // BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5 (male)
    // For demo, using age 30
    const age = 30
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5
    return Math.round(bmr)
  }

  // Calculate ideal weight range
  const getIdealWeightRange = (): { min: number; max: number } | null => {
    if (!height) return null
    const heightInMeters = height / 100
    // BMI range 18.5 - 22.9 is considered healthy
    const minBMI = 18.5
    const maxBMI = 22.9
    const minWeight = minBMI * heightInMeters * heightInMeters
    const maxWeight = maxBMI * heightInMeters * heightInMeters
    return {
      min: Math.round(minWeight),
      max: Math.round(maxWeight),
    }
  }

  const bmi = calculateBMI()
  const bmr = calculateBMR()
  const idealWeight = getIdealWeightRange()
  const bmiCategory = bmi ? getBMICategory(bmi) : null

  const handleEdit = () => {
    setIsEditing(true)
    onEdit?.()
  }

  return (
    <Card className="p-4 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-500" />
          {t.health.title}
        </h2>
        {onEdit && (
          <Button variant="ghost" size="icon" onClick={handleEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!height || !weight ? (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <Scale className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{t.health.noData}</p>
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="mt-3"
            >
              {t.health.addInfo}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* BMI Card */}
          {bmi && bmiCategory && (
            <div className={`${bmiCategory.bgColor} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t.health.bmi}
                </span>
                <Heart className={`h-4 w-4 ${bmiCategory.iconColor}`} />
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {bmi}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  kg/m²
                </span>
              </div>
              <div className={`text-sm font-medium ${bmiCategory.color}`}>
                {bmiCategory.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {bmiCategory.description}
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Height */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t.health.heightLabel}
              </div>
              <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {height}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                  {t.health.heightUnit}
                </span>
              </div>
            </div>

            {/* Weight */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {t.health.weightLabel}
              </div>
              <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {weight}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                  {t.health.weightUnit}
                </span>
              </div>
            </div>

            {/* BMR */}
            {bmr && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t.health.bmr}
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {bmr}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                    {t.food.calories}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t.health.basicMetabolicRate}
                </div>
              </div>
            )}

            {/* Ideal Weight Range */}
            {idealWeight && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t.health.idealWeight}
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {idealWeight.min} - {idealWeight.max}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                    {t.health.weightUnit}
                  </span>
                </div>
              </div>
            )}

            {/* Gender */}
            {gender && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {t.health.gender}
                </div>
                <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {gender === 'male' ? t.health.male : gender === 'female' ? t.health.female : t.health.other}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

