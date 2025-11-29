import { Router } from 'express'
import { chat, getChatHistory } from '@/controllers/chat.controller'

const router: Router = Router()

// Chat endpoint
router.post('/', chat)

// Get chat history
router.get('/history', getChatHistory)

export { router as chatRouter }

