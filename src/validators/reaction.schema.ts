import { z } from 'zod';

// Schema for reaction
export const reactionSchema = z.object({
  tweetId: z.number(),
});