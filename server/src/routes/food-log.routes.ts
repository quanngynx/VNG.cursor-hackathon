import { Router } from 'express';
import {
  createFoodLog,
  getFoodLogsByUserId,
  getFoodLogsByGuestId,
  getFoodLogsByDateRange,
  getDailyNutritionSummary,
  updateFoodLog,
  deleteFoodLog,
} from '@/controllers/food-log.controller';

const router: Router = Router();

// Create food log
router.post('/food-logs', createFoodLog);

// Get food logs by user ID
router.get('/food-logs/user/:userId', getFoodLogsByUserId);

// Get food logs by guest ID
router.get('/food-logs/guest/:guestId', getFoodLogsByGuestId);

// Get food logs by date range
router.get('/food-logs/user/:userId/date-range', getFoodLogsByDateRange);

// Get daily nutrition summary
router.get('/food-logs/user/:userId/summary', getDailyNutritionSummary);

// Update food log
router.put('/food-logs/:id', updateFoodLog);

// Delete food log
router.delete('/food-logs/:id', deleteFoodLog);

export { router as foodLogRouter };
