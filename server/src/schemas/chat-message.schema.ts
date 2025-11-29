import { z } from 'zod/v4';
import { baseDocumentSchema, timestampSchema } from './base.schema';

// Chat message schema
export const chatMessageSchema = z
  .object({
    userId: z.string().optional(),
    guestId: z.string().optional(),
    message: z.string().min(1),
    role: z.enum(['user', 'assistant', 'system']),
    metadata: z
      .object({
        model: z.string().optional(),
        tokens: z.number().optional(),
        responseTime: z.number().optional(),
      })
      .optional(),
  })
  .extend(baseDocumentSchema.shape)
  .extend(timestampSchema.shape);

// Schema for creating a new chat message
export const createChatMessageSchema = z.object({
  userId: z.string().optional(),
  guestId: z.string().optional(),
  message: z.string().min(1),
  role: z.enum(['user', 'assistant', 'system']),
  metadata: z
    .object({
      model: z.string().optional(),
      tokens: z.number().optional(),
      responseTime: z.number().optional(),
    })
    .optional(),
});

// Infer types from schemas
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type CreateChatMessageInput = z.infer<typeof createChatMessageSchema>;
