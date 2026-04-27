import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

// Middleware to validate request using Zod schema
export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement validation logic
  next();
};