import { Router } from 'express';
import { createComment, deleteComment, getCommentsReply, getCommentsByTweet, replyToComment } from '../controllers/comments.controller';
import { verifyToken } from '../middleware/auth.jwt';

const router = Router();

// Route to create a comment
router.post('/:tweetId', verifyToken,createComment);

//route to reply to commnet
router.post("/reply/:commentId",verifyToken,replyToComment)

//route to get commnet reply
router.get("/reply/:commentId",verifyToken,getCommentsReply)

// Route to get comments by tweetId
router.get('/tweet/:tweetId', getCommentsByTweet);

// Route to delete a comment
router.delete('/:id', verifyToken,deleteComment);

export default router;