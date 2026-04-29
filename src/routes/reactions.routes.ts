import { Router } from 'express';
import { likeComment, likeTweet, unlikeComment, unlikeTweet } from '../controllers/reactions.controller';
import { verifyToken } from '../middleware/auth.jwt';

const router = Router();

// Route to like a tweet
router.post('/tweets/:tweetId/like', verifyToken,likeTweet);

// Route to unlike a tweet
router.delete('/tweets/:tweetId/like',verifyToken, unlikeTweet);

router.post("/comments/:commentId",verifyToken,likeComment)

router.delete("/comments/:commentId",verifyToken,unlikeComment)


export default router;