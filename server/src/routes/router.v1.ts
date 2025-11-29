import { Router } from 'express'
import { foodLogRouter } from './food-log.routes'
import { chatRouter } from './chat.routes'
import { createFoodLog } from '@/controllers/food-log.controller'
import { getSummary } from '@/controllers/summary.controller'

// ROUTES FOR THE APP
const router: Router = Router()

// Check hello world
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello World' })
})

// Chat routes
router.use('/chat', chatRouter)

// Food log routes
router.use('/food-logs', foodLogRouter)

// API aliases for backward compatibility with docs
// POST /api/v1/log -> POST /api/v1/food-logs
router.post('/log', createFoodLog)

// GET /api/v1/summary?userId=xxx&date=xxx -> wrapper for summary
router.get('/summary', getSummary)

export { router as v1Router }
