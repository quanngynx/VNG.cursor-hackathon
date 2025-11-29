import { Request, Response, NextFunction } from 'express'
import { FoodLogRepository } from '@/repositories/food-log.repository'

/**
 * Get daily summary (alias endpoint for /api/v1/summary)
 * Query params: userId, date (optional)
 */
export const getSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId, guestId, date } = req.query

    if (!userId && !guestId) {
      res.status(400).json({
        success: false,
        error: 'userId or guestId is required',
      })
      return
    }

    const foodLogRepo = new FoodLogRepository()
    const targetDate = date ? new Date(date as string) : new Date()
    const targetId = (userId as string) || (guestId as string)
    const isGuest = !!guestId

    // Get summary - need to check if repository supports guestId
    let summary
    let logs

    if (isGuest) {
      // For guests, get logs by guestId and calculate manually
      const startOfDay = new Date(targetDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(targetDate)
      endOfDay.setHours(23, 59, 59, 999)

      const allLogs = await foodLogRepo.findByGuestId(targetId)
      logs = allLogs.filter((log) => {
        const logDate = new Date(log.loggedAt)
        return logDate >= startOfDay && logDate <= endOfDay
      })

      // Calculate summary from logs
      summary = logs.reduce(
        (acc, log) => ({
          calories: acc.calories + log.nutrition.calories,
          protein: acc.protein + log.nutrition.protein,
          carbs: acc.carbs + log.nutrition.carbs,
          fat: acc.fat + log.nutrition.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      )
    } else {
      // For users, use existing method
      summary = await foodLogRepo.getTotalNutritionByDate(
        targetId,
        targetDate,
      )

      // Get history for the day
      const startOfDay = new Date(targetDate)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(targetDate)
      endOfDay.setHours(23, 59, 59, 999)

      logs = await foodLogRepo.findByDateRange(
        targetId,
        startOfDay,
        endOfDay,
      )
    }

    // Format history
    const history = logs.map((log) => ({
      id: log.id,
      foodName: log.foodName,
      calories: log.nutrition.calories,
      macros: {
        protein: log.nutrition.protein,
        carbs: log.nutrition.carbs,
        fat: log.nutrition.fat,
      },
      timestamp: log.loggedAt,
      mealType: log.mealType,
    }))

    res.status(200).json({
      success: true,
      data: {
        totalCalories: summary.calories,
        totalMacros: {
          protein: summary.protein,
          carbs: summary.carbs,
          fat: summary.fat,
        },
        history,
      },
      date: targetDate.toISOString().split('T')[0],
    })
  } catch (error) {
    next(error)
  }
}

