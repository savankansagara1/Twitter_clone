import { Router } from 'express';
import { getUserProfile, updateUserProfile, getFollowers, getFollowing } from '../controllers/users.controller';

const router = Router();

// Route to get user profile
router.get('/:id', getUserProfile);

// Route to update user profile
router.put('/:id', updateUserProfile);

// Route to get followers
router.get('/:id/followers', getFollowers);

// Route to get following
router.get('/:id/following', getFollowing);

export default router;