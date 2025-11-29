'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface CalendarProps {
  selectedDate: string // YYYY-MM-DD format
  onDateSelect: (date: string) => void
}

export function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  // Parse selectedDate in local timezone to avoid timezone issues
  const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = parseLocalDate(selectedDate)
    return new Date(date.getFullYear(), date.getMonth(), 1)
  })

  const selectedDateObj = parseLocalDate(selectedDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  // Generate calendar days
  const days: (Date | null)[] = []
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ]

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    // Format date in local timezone
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    onDateSelect(`${year}-${month}-${day}`)
  }

  const isSelected = (date: Date | null) => {
    if (!date) return false
    return (
      date.getDate() === selectedDateObj.getDate() &&
      date.getMonth() === selectedDateObj.getMonth() &&
      date.getFullYear() === selectedDateObj.getFullYear()
    )
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const handleDateClick = (date: Date | null) => {
    if (!date) return
    // Format date in local timezone to avoid timezone issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    onDateSelect(`${year}-${month}-${day}`)
  }

  return (
    <Card className="p-4 bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <h3 className="font-semibold text-sm">
            {monthNames[month]} {year}
          </h3>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const selected = isSelected(date)
          const todayDate = isToday(date)

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleDateClick(date)}
              className={`
                aspect-square text-sm rounded-lg transition-colors
                ${selected
                  ? 'bg-orange-500 text-white font-semibold'
                  : todayDate
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

      {/* Today button */}
      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="text-xs"
        >
          Hôm nay
        </Button>
      </div>
    </Card>
  )
}

