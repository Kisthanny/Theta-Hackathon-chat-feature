import { Router } from 'express';
import { createUser, getUsers, getUser, updateUser, deleteUser, loginUser, getUserChannels } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/login', loginUser);
router.post('/create', authenticateToken, createUser);
router.get('/getUsers', authenticateToken, getUsers);
router.get('/getUserByAddress/:walletAddress', authenticateToken, getUser);
router.put('/update/:walletAddress', authenticateToken, updateUser);
router.delete('/delete/:walletAddress', authenticateToken, deleteUser);
router.get('/userChannels', authenticateToken, getUserChannels);


export default router;
