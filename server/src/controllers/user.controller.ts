import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '@/repositories/user.repository';
import { z } from 'zod/v4';

// Schema for health data update
const updateHealthDataSchema = z.object({
  height: z.number().min(50).max(250).optional(),
  weight: z.number().min(20).max(300).optional(),
  birthDate: z.date().or(z.string()).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  activityLevel: z
    .enum(['sedentary', 'light', 'moderate', 'active', 'very_active'])
    .optional(),
});

/**
 * Get user health data
 * Query params: userId or guestId
 */
export const getHealthData = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId, guestId } = req.query;

    if (!userId && !guestId) {
      res.status(400).json({
        success: false,
        error: 'userId or guestId is required',
      });
      return;
    }

    const userRepo = new UserRepository();
    const targetId = (userId as string) || (guestId as string);

    // Try to find user by ID
    const user = await userRepo.findById(targetId);

    if (!user) {
      // Return empty health data if user doesn't exist
      res.status(200).json({
        success: true,
        data: {},
      });
      return;
    }

    // Return health data
    res.status(200).json({
      success: true,
      data: {
        height: user.height,
        weight: user.weight,
        birthDate: user.birthDate,
        gender: user.gender,
        activityLevel: user.activityLevel,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user health data
 * Query params: userId or guestId
 * Body: health data fields
 */
export const updateHealthData = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId, guestId } = req.query;

    if (!userId && !guestId) {
      res.status(400).json({
        success: false,
        error: 'userId or guestId is required',
      });
      return;
    }

    // Validate request body
    const validatedData = updateHealthDataSchema.parse(req.body);

    const userRepo = new UserRepository();
    const targetId = (userId as string) || (guestId as string);

    // Check if user exists
    let user = await userRepo.findById(targetId);

    if (!user) {
      // Create a user document if it doesn't exist (for both guests and authenticated users)
      if (guestId) {
        // Create a guest user profile with guestId as document ID
        // Use a valid email format for guests
        const guestEmail = `guest.${targetId.replace(/[^a-zA-Z0-9]/g, '')}@nutrichat.local`;
        user = await userRepo.createWithId(targetId, {
          email: guestEmail,
          displayName: 'Guest User',
          role: 'user',
          isActive: true,
          ...validatedData,
        });
      } else {
        // For authenticated users, create with userId as document ID
        // We'll need to get user info from Firebase Auth or use a default email
        const userEmail = `user.${targetId.replace(/[^a-zA-Z0-9]/g, '')}@nutrichat.local`;
        user = await userRepo.createWithId(targetId, {
          email: userEmail,
          displayName: 'User',
          role: 'user',
          isActive: true,
          ...validatedData,
        });
      }
    } else {
      // Update existing user
      user = await userRepo.update(targetId, validatedData);
    }

    if (!user) {
      res.status(500).json({
        success: false,
        error: 'Failed to update health data',
      });
      return;
    }

    // Return updated health data
    res.status(200).json({
      success: true,
      data: {
        height: user.height,
        weight: user.weight,
        birthDate: user.birthDate,
        gender: user.gender,
        activityLevel: user.activityLevel,
      },
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
      console.error('Update health data error:', error.message);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update health data',
      });
      return;
    }

    next(error);
  }
};
