import { Router } from 'express';
import { uploadMedia } from '../controllers/media.controller';
import { upload } from '../middleware/upload.middleware';



const router = Router();

// Route to upload media
router.post('/upload', upload.single('file'), uploadMedia);

export default router;