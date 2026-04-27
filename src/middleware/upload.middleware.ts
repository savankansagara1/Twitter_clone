import { Request } from 'express';
import multer from 'multer';

 export const storage = multer.memoryStorage(); // Store files in memory for processing

// Middleware for file upload
export const upload = multer({
  storage
});