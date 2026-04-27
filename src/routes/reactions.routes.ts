import { Router } from 'express';
import { likeTweet, unlikeTweet } from '../controllers/reactions.controller';

const router = Router();

// Route to like a tweet
router.post('/:id/like', likeTweet);

// Route to unlike a tweet
router.delete('/:id/like', unlikeTweet);

export default router;