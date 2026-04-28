import { Router } from 'express';
import { likeTweet, unlikeTweet } from '../controllers/reactions.controller';
import { verifyToken } from '../middleware/auth.jwt';

const router = Router();

// Route to like a tweet
router.post('/:id/like', verifyToken,likeTweet);

// Route to unlike a tweet
router.delete('/:id/like',verifyToken, unlikeTweet);

export default router;