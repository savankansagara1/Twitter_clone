import { Router } from 'express';
import { getUserProfile, updateUserProfile, getFollowers, getFollowing } from '../controllers/users.controller';
import { verifyToken } from '../middleware/auth.jwt';

const router = Router();

// Route to get user profile
router.get('/:id', getUserProfile);

// Route to update user profile
router.post('/:id',verifyToken,updateUserProfile);

// Route to get followers
router.get('/:id/followers', verifyToken,getFollowers);

// Route to get following
router.get('/:id/following', getFollowing);

export default router;