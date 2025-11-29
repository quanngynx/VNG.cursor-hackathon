import { z } from 'zod/v4';

// Helper to handle Firestore Timestamp
const firestoreTimestamp = z.custom<any>((val) => {
  return (
    val &&
    typeof val === 'object' &&
    'seconds' in val &&
    'nanoseconds' in val &&
    typeof val.toDate === 'function'
  );
}, 'Invalid Timestamp');

// Base timestamp schema for all Firestore documents
export const timestampSchema = z.object({
  createdAt: z
    .date()
    .or(z.string())
    .or(firestoreTimestamp.transform((val) => val.toDate())),
  updatedAt: z
    .date()
    .or(z.string())
    .or(firestoreTimestamp.transform((val) => val.toDate())),
});

// Base document schema with ID
export const baseDocumentSchema = z.object({
  id: z.string(),
});

// Helper type for inferring schema types
export type InferSchema<T extends z.ZodType> = z.infer<T>;
