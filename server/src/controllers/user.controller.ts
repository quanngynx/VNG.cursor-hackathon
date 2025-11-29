import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '@/repositories/user.repository';
import { createUserSchema } from '@/schemas/user.schema';
import { z } from 'zod/v4';

/**
 * Get user by ID
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRepo = new UserRepository();
    const { id } = req.params;

    const user = await userRepo.findById(id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all users
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRepo = new UserRepository();
    const { page = '1', limit = '10' } = req.query;

    const result = await userRepo.findPaginated(
      parseInt(page as string),
      parseInt(limit as string),
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by email
 */
export const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRepo = new UserRepository();
    const { email } = req.query;

    if (!email) {
      res.status(400).json({
        success: false,
        error: 'Email query parameter is required',
      });
      return;
    }

    const user = await userRepo.findByEmail(email as string);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new user
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRepo = new UserRepository();

    // Validate request body with Zod
    const validatedData = createUserSchema.parse(req.body);

    const user = await userRepo.create(validatedData);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error,
      });
      return;
    }
    next(error);
  }
};

/**
 * Update user
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRepo = new UserRepository();
    const { id } = req.params;

    const updatedUser = await userRepo.update(id, req.body);

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRepo = new UserRepository();
    const { id } = req.params;

    const deleted = await userRepo.delete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get users by role
 */
export const getUsersByRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRepo = new UserRepository();
    const { role } = req.params;

    const users = await userRepo.findByRole(role);

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get active users
 */
export const getActiveUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userRepo = new UserRepository();

    const users = await userRepo.findActiveUsers();

    res.status(200).json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    next(error);
  }
};
