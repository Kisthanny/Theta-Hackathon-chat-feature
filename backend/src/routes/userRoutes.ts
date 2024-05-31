import { Router } from 'express';
import { createUser, getUsers, getUser, updateUser, deleteUser, loginUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/login', loginUser);
router.post('/', authenticateToken, createUser);
router.get('/', authenticateToken, getUsers);
router.get('/:walletAddress', authenticateToken, getUser);
router.put('/:walletAddress', authenticateToken, updateUser);
router.delete('/:walletAddress', authenticateToken, deleteUser);

export default router;
