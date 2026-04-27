import { z } from 'zod';

// Schema for follow
export const followSchema = z.object({
  userId: z.number(),
});