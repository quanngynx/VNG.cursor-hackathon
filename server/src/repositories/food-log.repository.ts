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
   * Helper to sort logs by date desc in memory
   */
  private sortLogs(logs: FoodLog[]): FoodLog[] {
    return logs.sort((a, b) => {
      const dateA = new Date(a.loggedAt).getTime();
      const dateB = new Date(b.loggedAt).getTime();
      return dateB - dateA;
    });
  }

  /**
   * Find food logs by user ID
   */
  async findByUserId(userId: string): Promise<FoodLog[]> {
    const logs = await this.findAll({
      where: [{ field: 'userId', operator: '==', value: userId }],
      // orderBy removed to avoid index requirements
    });
    return this.sortLogs(logs);
  }

  /**
   * Find food logs by guest ID
   */
  async findByGuestId(guestId: string): Promise<FoodLog[]> {
    const logs = await this.findAll({
      where: [{ field: 'guestId', operator: '==', value: guestId }],
      // orderBy removed to avoid index requirements
    });
    return this.sortLogs(logs);
  }

  /**
   * Find food logs by meal type
   */
  async findByMealType(userId: string, mealType: string): Promise<FoodLog[]> {
    const logs = await this.findAll({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'mealType', operator: '==', value: mealType },
      ],
      // orderBy removed to avoid index requirements
    });
    return this.sortLogs(logs);
  }

  /**
   * Find food logs within date range
   */
  async findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<FoodLog[]> {
    // We fetch all logs for the user and filter in memory to avoid complex composite index requirements
    // This is acceptable for a hackathon/small scale. For production, use proper indexes.
    const allLogs = await this.findAll({
      where: [{ field: 'userId', operator: '==', value: userId }],
    });

    const logs = allLogs.filter((log) => {
      const logDate = new Date(log.loggedAt);
      return logDate >= startDate && logDate <= endDate;
    });

    return this.sortLogs(logs);
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
