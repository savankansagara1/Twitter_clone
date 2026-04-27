import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Middleware to authenticate JWT token
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // TODO: Implement JWT verification and attach user to req
  next();
};