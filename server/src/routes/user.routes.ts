import { Router } from 'express';
import { getHealthData, updateHealthData } from '@/controllers/user.controller';

const router: Router = Router();

// Get user health data
// Path: GET /api/v1/user/health?userId=xxx or ?guestId=xxx
router.get('/health', getHealthData);

// Update user health data
// Path: PUT /api/v1/user/health?userId=xxx or ?guestId=xxx
router.put('/health', updateHealthData);

export { router as userRouter };
