import { Router } from 'express';
import {
  getUserById,
  getAllUsers,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  getUsersByRole,
  getActiveUsers,
} from '@/controllers/user.controller';

const router: Router = Router();

// Get user by ID
router.get('/users/:id', getUserById);

// Get all users (with pagination)
router.get('/users', getAllUsers);

// Get user by email (query parameter)
// Example: /users/search?email=user@example.com
router.get('/users/search', getUserByEmail);

// Create new user
router.post('/users', createUser);

// Update user
router.put('/users/:id', updateUser);

// Delete user
router.delete('/users/:id', deleteUser);

// Get users by role
router.get('/users/role/:role', getUsersByRole);

// Get active users
router.get('/users/active', getActiveUsers);

export { router as userRouter };
