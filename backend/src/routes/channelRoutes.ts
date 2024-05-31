import { Router } from 'express';
import { createChannel, getChannels, getChannel, updateChannel, deleteChannel } from '../controllers/channelController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateToken, createChannel);
router.get('/', authenticateToken, getChannels);
router.get('/:id', authenticateToken, getChannel);
router.put('/:id', authenticateToken, updateChannel);
router.delete('/:id', authenticateToken, deleteChannel);

export default router;
