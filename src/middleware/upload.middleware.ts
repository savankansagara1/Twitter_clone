import { Request } from 'express';
import multer from 'multer';
import { imagekit } from '../config';

 export const storage = multer.memoryStorage(); // Store files in memory for processing

// Middleware for file upload
export const upload = multer({
  storage
});

