import { Request, Response, NextFunction } from 'express'
import { AIService } from '@/services/ai.service'
import { ChatMessageRepository } from '@/repositories/chat-message.repository'
import { chatRequestSchema } from '@/schemas/chat.schema'
import { z } from 'zod/v4'

/**
 * Handle chat request and generate food suggestions
 */
export const chat = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = chatRequestSchema.parse(req.body)
    const { guestId, userId, message } = validatedData

    // Save user message to Firestore
    const chatRepo = new ChatMessageRepository()
    const startTime = Date.now()

    await chatRepo.create({
      guestId,
      userId,
      message,
      role: 'user',
    })

    // Generate food suggestions using AI
    const aiService = new AIService()
    const aiResponse = await aiService.generateFoodSuggestions(message)

    const responseTime = Date.now() - startTime

    // Save bot response to Firestore
    await chatRepo.create({
      guestId,
      userId,
      message: aiResponse.reply,
      role: 'assistant',
      metadata: {
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-20',
        responseTime,
      },
    })

    // Return response
    res.status(200).json({
      success: true,
      data: aiResponse,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      })
      return
    }

    if (error instanceof Error) {
      console.error('Chat error:', error.message)
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to process chat request',
      })
      return
    }

    next(error)
  }
}

/**
 * Get chat history for a user/guest
 */
export const getChatHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { guestId, userId } = req.query
    const limit = parseInt(req.query.limit as string) || 50

    if (!guestId && !userId) {
      res.status(400).json({
        success: false,
        error: 'guestId or userId is required',
      })
      return
    }

    const chatRepo = new ChatMessageRepository()
    const messages = await chatRepo.getConversationHistory(
      userId as string | undefined,
      guestId as string | undefined,
      limit,
    )

    res.status(200).json({
      success: true,
      data: messages,
    })
  } catch (error) {
    next(error)
  }
}

