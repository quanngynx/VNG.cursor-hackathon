# 🎉 Fake Data Generation - Complete

## ✅ What Was Created

You now have a complete seed data system that generates realistic fake data for testing!

### 📦 Packages Installed

- `@faker-js/faker@10.1.0` - Library for generating realistic fake data

### 📄 Files Created

1. **`src/scripts/seed-data.ts`** - Main seed script
2. **`src/scripts/README.md`** - Documentation
3. **Updated `package.json`** - Added `seed` script

## 🚀 How to Use

### Generate fake data

```bash
cd server
pnpm run seed
```

### What it creates

- ✅ **5 users** with fake profiles (names, emails, avatars)
- ✅ **~140 food logs** (7 days of meals for each user)
- ✅ **~50 chat messages** (conversations between users and AI)

## 📊 Default Configuration

The script creates:

- **5 users**
- **7 days** of food history per user
- **4 meals per day** (breakfast, lunch, dinner, snack)
- **5 conversations** per user (with AI responses)

## 🎨 Customize Data Generation

### Create more users

```typescript
// In seed-data.ts, change:
const userIds = await seedUsers(10); // Instead of 5
```

### More food logs

```typescript
await seedFoodLogs(userId, 30, 3); // 30 days, 3 meals/day
```

### More chat messages

```typescript
await seedChatMessages(userId, 20); // 20 conversations
```

## 🍔 Included Foods

The script includes 15 realistic foods with nutrition data:

- Grilled Chicken Breast (165 cal, 31g protein)
- Brown Rice (216 cal, 45g carbs)
- Scrambled Eggs (140 cal, 12g protein)
- Greek Yogurt (100 cal, 17g protein)
- Banana (105 cal, 27g carbs)
- Oatmeal (150 cal, 27g carbs)
- Salmon Fillet (280 cal, 39g protein)
- Sweet Potato (103 cal, 24g carbs)
- Broccoli (55 cal, 4g protein)
- Apple (95 cal, 25g carbs)
- Whole Wheat Bread (160 cal, 28g carbs)
- Peanut Butter (190 cal, 16g fat)
- Mixed Salad (50 cal, 3g protein)
- Almonds (164 cal, 14g fat)
- Avocado (120 cal, 11g fat)

## 💬 Sample Chat Questions

- "What should I eat for breakfast?"
- "How many calories are in a banana?"
- "Can you suggest a high-protein meal?"
- "What are some healthy snack options?"
- And more...

## 📝 Features

### Realistic Data

- Real-looking names and emails
- Proper nutrition values
- Time-stamped meals (breakfast at 7am, lunch at 11am, etc.)
- Natural conversation flow

### Type-Safe

- Uses your Zod schemas for validation
- Full TypeScript support
- Leverages your repository pattern

### Flexible

- Easy to customize food database
- Adjustable date ranges
- Configurable meal frequencies

## 🔍 Verify Your Data

### Check Firebase Console

1. Go to Firebase Console
2. Navigate to Firestore Database
3. You should see:
   - `users` collection with 5 users
   - `food_logs` collection with ~140 entries
   - `chat_messages` collection with ~50 messages

### Query via Repository

```typescript
import { UserRepository } from '@/repositories/user.repository';

const userRepo = new UserRepository();
const users = await userRepo.findAll();
console.log(`Total users: ${users.length}`);
```

## 🎯 Use Cases

### Development

- Test your UI with realistic data
- Develop features without manual data entry
- Preview how the app looks with real content

### Testing

- Generate test data for unit tests
- Create consistent test environments
- Populate staging environments

### Demos

- Showcase features with realistic data
- Present to stakeholders with proper content
- Create screenshots and documentation

## 🛠️ Troubleshooting

### Script fails to run

Make sure Firebase is initialized:

- Check that your service account key is in the correct location
- Verify Firebase Admin SDK is installed

### Want to clear data

Delete collections in Firebase Console or create a cleanup script

### Need different data

Modify the `FOODS` array or `CHAT_QUESTIONS` in `seed-data.ts`

## 📚 Next Steps

1. ✅ Run `pnpm run seed` to generate data
2. ✅ Check Firebase Console to verify
3. ✅ Start your server: `pnpm dev`
4. ✅ Test your API endpoints with the fake data
5. ✅ Build your frontend features with real-looking data

Happy testing! 🚀
