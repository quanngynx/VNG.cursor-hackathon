import { Request, Response, NextFunction } from 'express';
import { FoodLogRepository } from '@/repositories/food-log.repository';
import { createFoodLogSchema } from '@/schemas/food-log.schema';
import { z } from 'zod/v4';

/**
 * Create a new food log
 */
export const createFoodLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const foodLogRepo = new FoodLogRepository();

    // Validate request body with Zod
    const validatedData = createFoodLogSchema.parse(req.body);

    const foodLog = await foodLogRepo.create(validatedData);

    res.status(201).json({
      success: true,
      data: foodLog,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error,
      });
      return;
    }
    next(error);
  }
};

/**
 * Get food logs by user ID
 */
export const getFoodLogsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const foodLogRepo = new FoodLogRepository();
    const { userId } = req.params;

    const foodLogs = await foodLogRepo.findByUserId(userId);

    res.status(200).json({
      success: true,
      data: foodLogs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get food logs by guest ID
 */
export const getFoodLogsByGuestId = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const foodLogRepo = new FoodLogRepository();
    const { guestId } = req.params;

    const foodLogs = await foodLogRepo.findByGuestId(guestId);

    res.status(200).json({
      success: true,
      data: foodLogs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get food logs by date range
 */
export const getFoodLogsByDateRange = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const foodLogRepo = new FoodLogRepository();
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({
        success: false,
        error: 'startDate and endDate are required',
      });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    const foodLogs = await foodLogRepo.findByDateRange(userId, start, end);

    res.status(200).json({
      success: true,
      data: foodLogs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get daily nutrition summary
 */
export const getDailyNutritionSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const foodLogRepo = new FoodLogRepository();
    const { userId } = req.params;
    const { date } = req.query;

    const targetDate = date ? new Date(date as string) : new Date();

    const summary = await foodLogRepo.getTotalNutritionByDate(
      userId,
      targetDate,
    );

    res.status(200).json({
      success: true,
      data: summary,
      date: targetDate,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update food log
 */
export const updateFoodLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const foodLogRepo = new FoodLogRepository();
    const { id } = req.params;

    const updatedFoodLog = await foodLogRepo.update(id, req.body);

    if (!updatedFoodLog) {
      res.status(404).json({
        success: false,
        error: 'Food log not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedFoodLog,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete food log
 */
export const deleteFoodLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const foodLogRepo = new FoodLogRepository();
    const { id } = req.params;

    const deleted = await foodLogRepo.delete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'Food log not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Food log deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
