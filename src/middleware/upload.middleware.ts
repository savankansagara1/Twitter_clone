import { Request } from 'express';
import multer from 'multer';

// Middleware for file upload
export const upload = multer({
  // TODO: Configure multer with Cloudinary storage
});