import { faker } from '@faker-js/faker';
import { initializeFirebase } from '@/configs/firebase';
import { UserRepository } from '@/repositories/user.repository';
import { FoodLogRepository } from '@/repositories/food-log.repository';
import { ChatMessageRepository } from '@/repositories/chat-message.repository';
import type { CreateUserInput } from '@/schemas/user.schema';
import type { CreateFoodLogInput } from '@/schemas/food-log.schema';
import type { CreateChatMessageInput } from '@/schemas/chat-message.schema';

/**
 * Seed script to generate fake data for testing
 */

// Initialize Firebase before using repositories
initializeFirebase();

const userRepo = new UserRepository();
const foodLogRepo = new FoodLogRepository();
const chatRepo = new ChatMessageRepository();

// Food database for realistic food logs
const FOODS = [
  {
    name: 'Grilled Chicken Breast',
    portion: '150g',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
  },
  {
    name: 'Brown Rice',
    portion: '1 cup',
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
  },
  {
    name: 'Scrambled Eggs',
    portion: '2 eggs',
    calories: 140,
    protein: 12,
    carbs: 1,
    fat: 10,
  },
  {
    name: 'Greek Yogurt',
    portion: '1 cup',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0.4,
  },
  {
    name: 'Banana',
    portion: '1 medium',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
  },
  {
    name: 'Oatmeal',
    portion: '1 cup',
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
  },
  {
    name: 'Salmon Fillet',
    portion: '150g',
    calories: 280,
    protein: 39,
    carbs: 0,
    fat: 13,
  },
  {
    name: 'Sweet Potato',
    portion: '1 medium',
    calories: 103,
    protein: 2.3,
    carbs: 24,
    fat: 0.2,
  },
  {
    name: 'Broccoli',
    portion: '1 cup',
    calories: 55,
    protein: 4,
    carbs: 11,
    fat: 0.6,
  },
  {
    name: 'Apple',
    portion: '1 medium',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
  },
  {
    name: 'Whole Wheat Bread',
    portion: '2 slices',
    calories: 160,
    protein: 8,
    carbs: 28,
    fat: 2,
  },
  {
    name: 'Peanut Butter',
    portion: '2 tbsp',
    calories: 190,
    protein: 8,
    carbs: 7,
    fat: 16,
  },
  {
    name: 'Mixed Salad',
    portion: '1 bowl',
    calories: 50,
    protein: 3,
    carbs: 10,
    fat: 0.5,
  },
  {
    name: 'Almonds',
    portion: '1 oz',
    calories: 164,
    protein: 6,
    carbs: 6,
    fat: 14,
  },
  {
    name: 'Avocado',
    portion: '1/2 fruit',
    calories: 120,
    protein: 1.5,
    carbs: 6,
    fat: 11,
  },
];

const CHAT_QUESTIONS = [
  'What should I eat for breakfast?',
  'How many calories are in a banana?',
  'Can you suggest a high-protein meal?',
  'What are some healthy snack options?',
  'How much protein should I eat daily?',
  'What foods are good for weight loss?',
  'Can you recommend a balanced dinner?',
  'What are the benefits of eating vegetables?',
  'How can I track my daily nutrition?',
  'What should I eat before a workout?',
];

/**
 * Generate fake users
 */
async function seedUsers(count: number): Promise<string[]> {
  console.log(`🌱 Seeding ${count} users...`);
  const userIds: string[] = [];

  for (let i = 0; i < count; i++) {
    const userData: CreateUserInput = {
      email: faker.internet.email(),
      displayName: faker.person.fullName(),
      photoURL: faker.image.avatar(),
      phoneNumber: faker.phone.number(),
      role: faker.helpers.arrayElement(['user', 'admin', 'moderator'] as const),
      isActive: faker.datatype.boolean({ probability: 0.9 }),
    };

    try {
      const user = await userRepo.create(userData);
      userIds.push(user.id);
      console.log(`  ✓ Created user: ${user.displayName} (${user.email})`);
    } catch (error) {
      console.error(`  ✗ Failed to create user:`, error);
    }
  }

  return userIds;
}

/**
 * Generate fake food logs for a user
 */
async function seedFoodLogs(
  userId: string,
  daysBack: number = 7,
  mealsPerDay: number = 4,
): Promise<void> {
  console.log(
    `🍽️  Seeding food logs for user ${userId} (${daysBack} days, ${mealsPerDay} meals/day)...`,
  );

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

  for (let day = 0; day < daysBack; day++) {
    const date = new Date();
    date.setDate(date.getDate() - day);

    for (let meal = 0; meal < mealsPerDay; meal++) {
      const food = faker.helpers.arrayElement(FOODS);
      const mealTime = new Date(date);
      mealTime.setHours(7 + meal * 4, faker.number.int({ min: 0, max: 59 }));

      const foodLogData: CreateFoodLogInput = {
        userId,
        foodName: food.name,
        mealType: mealTypes[meal % mealTypes.length],
        portion: food.portion,
        nutrition: {
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          fiber: faker.number.float({ min: 0, max: 10, fractionDigits: 1 }),
          sugar: faker.number.float({ min: 0, max: 20, fractionDigits: 1 }),
        },
        loggedAt: mealTime,
        notes: faker.datatype.boolean({ probability: 0.3 })
          ? faker.lorem.sentence()
          : undefined,
      };

      try {
        await foodLogRepo.create(foodLogData);
      } catch (error) {
        console.error(`  ✗ Failed to create food log:`, error);
      }
    }
  }

  console.log(`  ✓ Created food logs for user ${userId}`);
}

/**
 * Generate fake chat messages for a user
 */
async function seedChatMessages(
  userId: string,
  messageCount: number = 10,
): Promise<void> {
  console.log(`💬 Seeding ${messageCount} chat messages for user ${userId}...`);

  for (let i = 0; i < messageCount; i++) {
    // User question
    const userMessage: CreateChatMessageInput = {
      userId,
      message: faker.helpers.arrayElement(CHAT_QUESTIONS),
      role: 'user',
    };

    try {
      await chatRepo.create(userMessage);

      // Assistant response
      await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay

      const assistantMessage: CreateChatMessageInput = {
        userId,
        message: faker.lorem.paragraph({ min: 2, max: 4 }),
        role: 'assistant',
        metadata: {
          model: 'gpt-4',
          tokens: faker.number.int({ min: 50, max: 500 }),
          responseTime: faker.number.int({ min: 100, max: 2000 }),
        },
      };

      await chatRepo.create(assistantMessage);
    } catch (error) {
      console.error(`  ✗ Failed to create chat messages:`, error);
    }
  }

  console.log(`  ✓ Created chat messages for user ${userId}`);
}

/**
 * Main seed function
 */
async function seed() {
  console.log('🚀 Starting data seeding...\n');

  try {
    // Create users
    const userIds = await seedUsers(5);
    console.log(`\n✅ Created ${userIds.length} users\n`);

    // Create food logs and chat messages for each user
    for (const userId of userIds) {
      await seedFoodLogs(userId, 7, 4); // 7 days, 4 meals per day
      await seedChatMessages(userId, 5); // 5 conversations
      console.log('');
    }

    console.log('🎉 Data seeding completed successfully!\n');

    // Print summary
    console.log('📊 Summary:');
    console.log(`  - Users created: ${userIds.length}`);
    console.log(`  - Food logs created: ~${userIds.length * 7 * 4}`);
    console.log(`  - Chat messages created: ~${userIds.length * 5 * 2}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run seed function
void seed();
