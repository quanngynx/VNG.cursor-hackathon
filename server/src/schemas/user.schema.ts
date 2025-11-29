import { z } from 'zod/v4';
import { baseDocumentSchema, timestampSchema } from './base.schema';

// User schema
export const userSchema = z
  .object({
    email: z.email(),
    displayName: z.string().min(1).max(100),
    photoURL: z.url().optional(),
    phoneNumber: z.string().optional(),
    role: z.enum(['user', 'admin', 'moderator']).default('user'),
    isActive: z.boolean().default(true),
    lastLoginAt: z.date().or(z.string()).optional(),
  })
  .extend(baseDocumentSchema.shape)
  .extend(timestampSchema.shape);

// Schema for creating a new user (without id and timestamps)
export const createUserSchema = z.object({
  email: z.email(),
  displayName: z.string().min(1).max(100),
  photoURL: z.url().optional(),
  phoneNumber: z.string().optional(),
  role: z.enum(['user', 'admin', 'moderator']).default('user'),
  isActive: z.boolean().default(true),
  lastLoginAt: z.date().or(z.string()).optional(),
});

// Schema for updating a user (all fields optional)
export const updateUserSchema = createUserSchema.partial();

// Infer types from schemas
export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
