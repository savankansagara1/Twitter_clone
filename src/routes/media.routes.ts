import { Router } from 'express';
import { uploadMedia } from '../controllers/media.controller';

const router = Router();

// Route to upload media
router.post('/upload', uploadMedia);

export default router;