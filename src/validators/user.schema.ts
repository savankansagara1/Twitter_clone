import { z } from 'zod';

// Schema for user
export const userSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  bio: z.string().optional(),
});