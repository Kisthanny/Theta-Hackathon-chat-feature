import { Router } from 'express';
import { createChannel, getChannels, getChannel, updateChannel, deleteChannel, joinChannel, muteChannel, unmuteChannel } from '../controllers/channelController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/createChannel', authenticateToken, createChannel);
router.get('/getChannels', authenticateToken, getChannels);
router.get('/getChannelById/:id', authenticateToken, getChannel);
router.put('/update/:id', authenticateToken, updateChannel);
router.delete('/delete/:id', authenticateToken, deleteChannel);
router.post('/join/:id', authenticateToken, joinChannel);
router.put('/mute/:channelId', authenticateToken, muteChannel);
router.put('/unmute/:channelId', authenticateToken, unmuteChannel);

export default router;
