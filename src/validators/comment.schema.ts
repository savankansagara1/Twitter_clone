import { z } from 'zod';

// Schema for comment
export const commentSchema = z.object({
  content: z.string().max(280),
});