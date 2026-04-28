import { Router } from 'express';
import { createTweet, getTweets, deleteTweet, getFeed } from '../controllers/tweets.controller';
import { verifyToken } from '../middleware/auth.jwt';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Route to create a tweet
router.post('/', verifyToken, upload.single('file'),createTweet);

// Route to get tweets
router.get('/', verifyToken, getTweets);

// Route to get feed
router.get('/feed', verifyToken, getFeed);

// Route to delete a tweet
router.delete('/:id', verifyToken, deleteTweet);

export default router;