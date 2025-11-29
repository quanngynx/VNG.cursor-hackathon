import { FoodLogRepository } from '@/repositories/food-log.repository';
import { UserRepository } from '@/repositories/user.repository';
import { ChatMessageRepository } from '@/repositories/chat-message.repository';
import { CreateFoodLogInput } from '@/schemas/food-log.schema';
import { CreateUserInput } from '@/schemas/user.schema';
import { CreateChatMessageInput } from '@/schemas/chat-message.schema';

/**
 * Example service demonstrating how to use repositories
 */
export class ExampleFirebaseService {
  private foodLogRepo: FoodLogRepository;
  private userRepo: UserRepository;
  private chatRepo: ChatMessageRepository;

  constructor() {
    this.foodLogRepo = new FoodLogRepository();
    this.userRepo = new UserRepository();
    this.chatRepo = new ChatMessageRepository();
  }

  /**
   * Example: Create a new user
   */
  async createUser(userData: CreateUserInput) {
    try {
      const user = await this.userRepo.create(userData);
      return { success: true, data: user };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Failed to create user' };
    }
  }

  /**
   * Example: Log a meal for a user
   */
  async logMeal(foodLogData: CreateFoodLogInput) {
    try {
      const foodLog = await this.foodLogRepo.create(foodLogData);
      return { success: true, data: foodLog };
    } catch (error) {
      console.error('Error logging meal:', error);
      return { success: false, error: 'Failed to log meal' };
    }
  }

  /**
   * Example: Get user's daily nutrition summary
   */
  async getDailyNutritionSummary(userId: string, date: Date = new Date()) {
    try {
      const summary = await this.foodLogRepo.getTotalNutritionByDate(
        userId,
        date,
      );
      return { success: true, data: summary, date };
    } catch (error) {
      console.error('Error getting nutrition summary:', error);
      return { success: false, error: 'Failed to get nutrition summary' };
    }
  }

  /**
   * Example: Save chat message
   */
  async saveChatMessage(messageData: CreateChatMessageInput) {
    try {
      const message = await this.chatRepo.create(messageData);
      return { success: true, data: message };
    } catch (error) {
      console.error('Error saving chat message:', error);
      return { success: false, error: 'Failed to save chat message' };
    }
  }

  /**
   * Example: Get user's food history with pagination
   */
  async getUserFoodHistory(userId: string, page = 1, limit = 10) {
    try {
      const result = await this.foodLogRepo.findPaginated(page, limit, {
        where: [{ field: 'userId', operator: '==', value: userId }],
        orderBy: { field: 'loggedAt', direction: 'desc' },
      });
      return { success: true, ...result };
    } catch (error) {
      console.error('Error getting food history:', error);
      return { success: false, error: 'Failed to get food history' };
    }
  }

  /**
   * Example: Get weekly nutrition trends
   */
  async getWeeklyNutritionTrends(userId: string) {
    try {
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);

      const logs = await this.foodLogRepo.findByDateRange(
        userId,
        weekAgo,
        today,
      );

      // Group by date
      const dailyData: Record<
        string,
        { calories: number; protein: number; carbs: number; fat: number }
      > = {};

      logs.forEach((log) => {
        const dateKey = new Date(log.loggedAt).toISOString().split('T')[0];
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
        }
        dailyData[dateKey].calories += log.nutrition.calories;
        dailyData[dateKey].protein += log.nutrition.protein;
        dailyData[dateKey].carbs += log.nutrition.carbs;
        dailyData[dateKey].fat += log.nutrition.fat;
      });

      return { success: true, data: dailyData };
    } catch (error) {
      console.error('Error getting weekly trends:', error);
      return { success: false, error: 'Failed to get weekly trends' };
    }
  }

  /**
   * Example: Find user by email or create if doesn't exist
   */
  async findOrCreateUser(email: string, displayName: string) {
    try {
      let user = await this.userRepo.findByEmail(email);

      if (!user) {
        user = await this.userRepo.create({
          email,
          displayName,
          role: 'user',
          isActive: true,
        });
      }

      return { success: true, data: user };
    } catch (error) {
      console.error('Error finding/creating user:', error);
      return { success: false, error: 'Failed to find/create user' };
    }
  }
}
