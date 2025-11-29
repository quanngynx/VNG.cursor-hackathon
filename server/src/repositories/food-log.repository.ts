import { BaseRepository } from './base.repository';
import { FoodLog, foodLogSchema } from '@/schemas/food-log.schema';

/**
 * Food log repository for food log-specific operations
 */
export class FoodLogRepository extends BaseRepository<FoodLog> {
  constructor() {
    super('food_logs', foodLogSchema);
  }

  /**
   * Find food logs by user ID
   */
  async findByUserId(userId: string): Promise<FoodLog[]> {
    return this.findAll({
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: { field: 'loggedAt', direction: 'desc' },
    });
  }

  /**
   * Find food logs by guest ID
   */
  async findByGuestId(guestId: string): Promise<FoodLog[]> {
    return this.findAll({
      where: [{ field: 'guestId', operator: '==', value: guestId }],
      orderBy: { field: 'loggedAt', direction: 'desc' },
    });
  }

  /**
   * Find food logs by meal type
   */
  async findByMealType(userId: string, mealType: string): Promise<FoodLog[]> {
    return this.findAll({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'mealType', operator: '==', value: mealType },
      ],
      orderBy: { field: 'loggedAt', direction: 'desc' },
    });
  }

  /**
   * Find food logs within date range
   */
  async findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<FoodLog[]> {
    return this.findAll({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'loggedAt', operator: '>=', value: startDate },
        { field: 'loggedAt', operator: '<=', value: endDate },
      ],
      orderBy: { field: 'loggedAt', direction: 'desc' },
    });
  }

  /**
   * Calculate total nutrition for user on a specific date
   */
  async getTotalNutritionByDate(
    userId: string,
    date: Date,
  ): Promise<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await this.findByDateRange(userId, startOfDay, endOfDay);

    return logs.reduce(
      (totals, log) => ({
        calories: totals.calories + log.nutrition.calories,
        protein: totals.protein + log.nutrition.protein,
        carbs: totals.carbs + log.nutrition.carbs,
        fat: totals.fat + log.nutrition.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }
}
