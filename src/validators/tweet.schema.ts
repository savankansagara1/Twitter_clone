import { z } from 'zod';

// Schema for tweet
export const tweetSchema = z.object({
  content: z.string().max(280),
  media: z.array(z.string()).optional(),
});