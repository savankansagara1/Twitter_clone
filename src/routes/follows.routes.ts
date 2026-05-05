import { Router } from 'express';
import { followUser, isFollowing, unfollowUser } from '../controllers/follows.controller';
import { getFollowers } from '../controllers/users.controller';
import { verifyToken } from '../middleware/auth.jwt';

const router = Router();

// Route to follow a user
router.post('/:userId',verifyToken, followUser);

// Route to unfollow a user
router.delete('/:userId',verifyToken, unfollowUser);

// GET /api/follows/:userId/is-following
router.get("/:userId/is-following", verifyToken, isFollowing);

export default router;