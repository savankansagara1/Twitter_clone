import { Router } from 'express';
import { getNotifications, markAsRead } from '../controllers/notifications.controller';

const router = Router();

// Route to get notifications
router.get('/', getNotifications);

// Route to mark notification as read
router.put('/:id/read', markAsRead);

export default router;