import { Router } from 'express';
import { getNotifications, markAsRead } from '../controllers/notifications.controller';
import { verifyToken } from '../middleware/auth.jwt';

const router = Router();

// Route to get notifications
router.get('/', verifyToken, getNotifications);

// Route to mark notification as read
router.put('/:id/read', markAsRead);

export default router;