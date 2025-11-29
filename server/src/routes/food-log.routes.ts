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
// Path: POST /api/v1/food-logs
router.post('/', createFoodLog);

// Get food logs by user ID
// Path: GET /api/v1/food-logs/user/:userId
router.get('/user/:userId', getFoodLogsByUserId);

// Get food logs by guest ID
// Path: GET /api/v1/food-logs/guest/:guestId
router.get('/guest/:guestId', getFoodLogsByGuestId);

// Get food logs by date range
// Path: GET /api/v1/food-logs/user/:userId/date-range
router.get('/user/:userId/date-range', getFoodLogsByDateRange);

// Get daily nutrition summary
// Path: GET /api/v1/food-logs/user/:userId/summary
router.get('/user/:userId/summary', getDailyNutritionSummary);

// Update food log
// Path: PUT /api/v1/food-logs/:id
router.put('/:id', updateFoodLog);

// Delete food log
// Path: DELETE /api/v1/food-logs/:id
router.delete('/:id', deleteFoodLog);

export { router as foodLogRouter };
