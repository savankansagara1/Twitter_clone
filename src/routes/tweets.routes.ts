import { Router } from 'express';
import { createTweet, getTweets, deleteTweet, getFeed } from '../controllers/tweets.controller';

const router = Router();

// Route to create a tweet
router.post('/', createTweet);

// Route to get tweets
router.get('/', getTweets);

// Route to get feed
router.get('/feed', getFeed);

// Route to delete a tweet
router.delete('/:id', deleteTweet);

export default router;