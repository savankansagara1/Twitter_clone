import { Router } from 'express';
import { followUser, unfollowUser } from '../controllers/follows.controller';

const router = Router();

// Route to follow a user
router.post('/:id/follow', followUser);

// Route to unfollow a user
router.delete('/:id/follow', unfollowUser);

export default router;