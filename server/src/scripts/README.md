# Seed Data Scripts

This directory contains scripts for generating fake/test data for your Firebase collections.

## Available Scripts

### `seed-data.ts`

Generates fake users, food logs, and chat messages for testing.

## Usage

### Run the seed script

```bash
pnpm seed
```

### What it creates

- **5 users** with fake profiles
- **~140 food logs** (7 days × 4 meals/day × 5 users)
- **~50 chat messages** (5 conversations × 2 messages × 5 users)

## Customization

You can edit `seed-data.ts` to customize:

### Change the number of users

```typescript
const userIds = await seedUsers(10); // Create 10 users instead of 5
```

### Change food logs parameters

```typescript
await seedFoodLogs(userId, 30, 3); // 30 days, 3 meals per day
```

### Change chat messages

```typescript
await seedChatMessages(userId, 20); // 20 conversations
```

## Food Database

The script includes 15 pre-defined foods with realistic nutrition data:

- Grilled Chicken Breast
- Brown Rice
- Scrambled Eggs
- Greek Yogurt
- Banana
- And more...

## Adding Custom Foods

Add your custom foods to the `FOODS` array in `seed-data.ts`:

```typescript
const FOODS = [
  {
    name: 'Your Food Name',
    portion: '100g',
    calories: 200,
    protein: 20,
    carbs: 30,
    fat: 5,
  },
  // ... more foods
];
```

## Tips

1. **Run seed once** - The script creates new data each time it runs
2. **Check Firebase Console** - Verify data in your Firestore dashboard
3. **Modify as needed** - Customize the data generation to match your needs

## Example Output

```
🚀 Starting data seeding...

🌱 Seeding 5 users...
  ✓ Created user: John Doe (john.doe@example.com)
  ✓ Created user: Jane Smith (jane.smith@example.com)
  ...

✅ Created 5 users

🍽️  Seeding food logs for user abc123...
  ✓ Created food logs for user abc123

💬 Seeding 5 chat messages for user abc123...
  ✓ Created chat messages for user abc123

🎉 Data seeding completed successfully!

📊 Summary:
  - Users created: 5
  - Food logs created: ~140
  - Chat messages created: ~50
```
