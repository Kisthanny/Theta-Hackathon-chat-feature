import { Router } from 'express';
import { createMessage, getMessages, getMessage, updateMessage, deleteMessage } from '../controllers/messageController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createMessage);
router.get('/', authenticateToken, getMessages);
router.get('/:id', authenticateToken, getMessage);
router.put('/:id', authenticateToken, updateMessage);
router.delete('/:id', authenticateToken, deleteMessage);

export default router;
