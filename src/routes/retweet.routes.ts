import { Router } from 'express';
import { retweetTweet, undoRetweet } from '../controllers/retweets.controller';
import { verifyToken } from '../middleware/auth.jwt';

const router = Router();


router.post('/:tweetId',verifyToken,retweetTweet)
router.delete('/:tweetId', verifyToken,undoRetweet)



export default router