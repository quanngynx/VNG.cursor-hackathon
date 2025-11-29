import { z } from 'zod/v4';

// Base timestamp schema for all Firestore documents
export const timestampSchema = z.object({
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

// Base document schema with ID
export const baseDocumentSchema = z.object({
  id: z.string(),
});

// Helper type for inferring schema types
export type InferSchema<T extends z.ZodType> = z.infer<T>;
