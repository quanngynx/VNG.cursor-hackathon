import { Router } from 'express';
import {
  chat,
  getChatHistory,
  getCookingGuide,
  getCookingGuideById,
  getCookingGuideHistory,
} from '@/controllers/chat.controller';

const router: Router = Router();

// Chat endpoint
router.post('/', chat);

// Get chat history
router.get('/history', getChatHistory);

// Cooking guide endpoints
router.post('/cooking-guide', getCookingGuide);
router.get('/cooking-guide/history', getCookingGuideHistory);
router.get('/cooking-guide/:id', getCookingGuideById);

export { router as chatRouter };
