import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { ignoreCase } from '../controllers/userController';

export interface AuthRequest extends Request {
    user?: jwt.JwtPayload;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET_KEY as string);
        req.user = verified as jwt.JwtPayload;

        const existingUser = await User.findOne({ walletAddress: ignoreCase(req.user.walletAddress) });
        if (!existingUser) {
            return res.status(401).send('User does not exist');
        }

        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};
