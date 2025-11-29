import { Request, Response, NextFunction } from 'express';
import { AIService } from '@/services/ai.service';
import { ChatMessageRepository } from '@/repositories/chat-message.repository';
import { CookingGuideRepository } from '@/repositories/cooking-guide.repository';
import { chatRequestSchema, cookingGuideRequestSchema } from '@/schemas/chat.schema';
import { z } from 'zod/v4';

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
    const validatedData = chatRequestSchema.parse(req.body);
    const { guestId, userId, message } = validatedData;

    // Save user message to Firestore
    const chatRepo = new ChatMessageRepository();
    const startTime = Date.now();

    await chatRepo.create({
      guestId,
      userId,
      message,
      role: 'user',
    });

    // Generate food suggestions using AI
    const aiService = new AIService();
    const aiResponse = await aiService.generateFoodSuggestions(message);

    const responseTime = Date.now() - startTime;

    // Save bot response to Firestore
    await chatRepo.create({
      guestId,
      userId,
      message: aiResponse.reply,
      role: 'assistant',
      metadata: {
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-20',
        responseTime,
        suggestions: aiResponse.suggestions, // Save suggestions to metadata
      },
    });

    // Return response
    res.status(200).json({
      success: true,
      data: aiResponse,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }

    if (error instanceof Error) {
      console.error('Chat error:', error.message);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to process chat request',
      });
      return;
    }

    next(error);
  }
};

/**
 * Get chat history for a user/guest
 */
export const getChatHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { guestId, userId } = req.query;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!guestId && !userId) {
      res.status(400).json({
        success: false,
        error: 'guestId or userId is required',
      });
      return;
    }

    const chatRepo = new ChatMessageRepository();
    const messages = await chatRepo.getConversationHistory(
      userId as string | undefined,
      guestId as string | undefined,
      limit,
    );

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate cooking guide for a dish and save to database
 */
export const getCookingGuide = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // Validate request body
    const validatedData = cookingGuideRequestSchema.parse(req.body);
    const { guestId, userId, dishName, language } = validatedData;

    // Generate cooking guide using AI
    const aiService = new AIService();
    const cookingGuide = await aiService.generateCookingGuide(dishName, language);

    // Save cooking guide to database
    const cookingGuideRepo = new CookingGuideRepository();
    const savedGuide = await cookingGuideRepo.create({
      guestId,
      userId,
      ...cookingGuide,
    });

    // Return response with the saved guide (includes ID)
    res.status(200).json({
      success: true,
      data: savedGuide,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }

    if (error instanceof Error) {
      console.error('Cooking guide error:', error.message);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate cooking guide',
      });
      return;
    }

    next(error);
  }
};

/**
 * Get cooking guide by ID
 */
export const getCookingGuideById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Guide ID is required',
      });
      return;
    }

    const cookingGuideRepo = new CookingGuideRepository();
    const guide = await cookingGuideRepo.findByGuideId(id);

    if (!guide) {
      res.status(404).json({
        success: false,
        error: 'Cooking guide not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: guide,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all cooking guides for a user/guest
 */
export const getCookingGuideHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { guestId, userId } = req.query;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!guestId && !userId) {
      res.status(400).json({
        success: false,
        error: 'guestId or userId is required',
      });
      return;
    }

    const cookingGuideRepo = new CookingGuideRepository();
    let guides;

    if (userId) {
      guides = await cookingGuideRepo.findByUserId(userId as string, limit);
    } else {
      guides = await cookingGuideRepo.findByGuestId(guestId as string, limit);
    }

    res.status(200).json({
      success: true,
      data: guides,
    });
  } catch (error) {
    next(error);
  }
};
