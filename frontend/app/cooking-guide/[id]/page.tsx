'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { chatApi } from '@/lib/api'
import type { CookingGuide, CookingStep } from '@/types/api'
import Image from 'next/image'

function DifficultyBadge({ difficulty }: { difficulty: CookingGuide['difficulty'] }) {
  const colors = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  const labels = {
    easy: 'Dễ',
    medium: 'Trung bình',
    hard: 'Khó',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[difficulty]}`}>
      {labels[difficulty]}
    </span>
  )
}

function StepImage({ step }: { step: CookingStep }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  if (!step.image || imageError) {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl flex items-center justify-center">
        <span className="text-6xl">🍳</span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20">
      {/* Loading Animation */}
      {imageLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="relative">
            {/* Oven/Baking animation */}
            <div className="w-20 h-20 bg-gradient-to-b from-orange-400 to-orange-600 rounded-xl shadow-lg flex items-center justify-center animate-pulse">
              <span className="text-4xl animate-bounce">🍞</span>
            </div>
            {/* Steam effect */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-2 h-6 bg-gray-300/60 rounded-full animate-steam-1" />
              <div className="w-2 h-8 bg-gray-300/60 rounded-full animate-steam-2" />
              <div className="w-2 h-5 bg-gray-300/60 rounded-full animate-steam-3" />
            </div>
          </div>
          <p className="mt-4 text-orange-600 font-medium animate-pulse">
            Đang nướng ảnh...
          </p>
        </div>
      )}
      <Image
        src={step.image}
        alt={step.title}
        fill
        className={`object-cover transition-opacity duration-500 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true)
          setImageLoading(false)
        }}
        unoptimized
      />
    </div>
  )
}

function StepCard({ step, isActive, onClick }: { step: CookingStep; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center ${
        isActive
          ? 'border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/30'
          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 bg-white dark:bg-gray-800'
      }`}
    >
      <span className="text-xl font-bold">{step.step}</span>
      {step.duration && (
        <span className="text-xs opacity-75">{step.duration}</span>
      )}
    </button>
  )
}

export default function CookingGuidePage() {
  const params = useParams()
  const router = useRouter()
  const guideId = params.id as string

  const [guide, setGuide] = useState<CookingGuide | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const fetchGuide = async () => {
      if (!guideId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await chatApi.getCookingGuideById(guideId)
        if (response.success && response.data) {
          setGuide(response.data)
        } else {
          setError(response.error || 'Không tìm thấy hướng dẫn nấu ăn')
        }
      } catch (err) {
        console.error('Failed to fetch cooking guide:', err)
        setError('Không thể tải hướng dẫn nấu ăn')
      } finally {
        setIsLoading(false)
      }
    }

    fetchGuide()
  }, [guideId])

  const handlePrevStep = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1)
  }

  const handleNextStep = () => {
    if (guide && activeStep < guide.steps.length - 1) setActiveStep(activeStep + 1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
          <p className="text-gray-600 dark:text-gray-400">Đang tải hướng dẫn...</p>
        </div>
      </div>
    )
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-6xl">😢</p>
          <p className="text-gray-600 dark:text-gray-400">{error || 'Không tìm thấy hướng dẫn'}</p>
          <Button onClick={() => router.push('/')}>Quay về trang chủ</Button>
        </div>
      </div>
    )
  }

  const currentStep = guide.steps[activeStep]

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors"
          >
            <span>←</span>
            <span>Quay lại</span>
          </button>
          <h1 className="text-lg font-bold text-center flex-1 mx-4 truncate">
            {guide.dishName}
          </h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Dish Info */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold">👨‍🍳 {guide.dishName}</h2>
            <DifficultyBadge difficulty={guide.difficulty} />
          </div>
          <div className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-xl">⏱️</span>
              <span>{guide.totalTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🍽️</span>
              <span>{guide.servings} phần</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ingredients */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🥬</span> Nguyên liệu
              </h3>
              <ul className="space-y-3">
                {guide.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <span className="text-gray-700 dark:text-gray-300">{ingredient.name}</span>
                    <span className="text-orange-600 font-medium">{ingredient.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Chef Tips */}
            {guide.chefTips && guide.chefTips.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-3xl p-6 shadow-lg border border-amber-200 dark:border-amber-800">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <span>💡</span> Mẹo đầu bếp
                </h3>
                <ul className="space-y-3">
                  {guide.chefTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-amber-700 dark:text-amber-300">
                      <span className="text-amber-500">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Steps */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>📝</span> Các bước thực hiện
              </h3>

              {/* Step Navigation */}
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                {guide.steps.map((step, index) => (
                  <StepCard
                    key={step.step}
                    step={step}
                    isActive={index === activeStep}
                    onClick={() => setActiveStep(index)}
                  />
                ))}
              </div>

              {/* Current Step */}
              {currentStep && (
                <div className="mt-6 space-y-4">
                  {/* Step Image - key forces re-mount on step change */}
                  <StepImage key={`step-image-${currentStep.step}`} step={currentStep} />

                  {/* Step Content */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold">
                        Bước {currentStep.step}: {currentStep.title}
                      </h4>
                      {currentStep.duration && (
                        <span className="text-orange-600 font-medium flex items-center gap-1">
                          <span>⏱️</span> {currentStep.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                      {currentStep.description}
                    </p>

                    {/* Tips for this step */}
                    {currentStep.tips && (
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                        <p className="text-amber-800 dark:text-amber-200">
                          💡 <strong>Mẹo:</strong> {currentStep.tips}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Step Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      disabled={activeStep === 0}
                      className="px-6"
                    >
                      ← Bước trước
                    </Button>
                    <span className="flex items-center text-gray-500 font-medium">
                      {activeStep + 1} / {guide.steps.length}
                    </span>
                    <Button
                      onClick={handleNextStep}
                      disabled={activeStep === guide.steps.length - 1}
                      className="px-6 bg-orange-500 hover:bg-orange-600"
                    >
                      Bước tiếp →
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

