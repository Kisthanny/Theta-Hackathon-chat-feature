import { Router } from 'express';
import { createMessage, getMessages, recallMessage } from '../controllers/messageController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/sendMessage', authenticateToken, createMessage);
router.get('/getMessagesFromChannel/:channelId/:size/:page', authenticateToken, getMessages);
router.delete('/recall/:messageId', authenticateToken, recallMessage);

export default router;
