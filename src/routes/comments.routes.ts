import { Router } from 'express';
import { createComment, getComments, deleteComment } from '../controllers/comments.controller';
import { verifyToken } from '../middleware/auth.jwt';

const router = Router();

// Route to create a comment
router.post('/:tweetId', createComment);

// Route to get comments
router.get('/:tweetId', getComments);

// Route to delete a comment
router.delete('/:id', deleteComment);

export default router;