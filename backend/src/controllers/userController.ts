import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { verifyMessage } from 'ethers';
import Channel from '../models/Channel';

export interface AuthRequest extends Request {
    user?: jwt.JwtPayload & { walletAddress?: string };
}

export const ignoreCase = (textString: string) => {
    return new RegExp(`^${textString}$`, 'i')
}

export const createUser = async (req: AuthRequest, res: Response) => {
    try {
        const { walletAddress } = req.body;

        const existingUser = await User.findOne({ walletAddress: ignoreCase(walletAddress) });

        if (existingUser) {
            return res.status(400).send({ error: 'Wallet address already exists' });
        }
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find({}, { walletAddress: 1, userName: 1, createdAt: 1 });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getUser = async (req: AuthRequest, res: Response) => {
    try {
        const { walletAddress } = req.params;
        const user = await User.findOne({ walletAddress: ignoreCase(walletAddress) }, { walletAddress: 1, userName: 1, createdAt: 1 });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const { walletAddress } = req.params;

        if (!req.user || !req.user.walletAddress) {
            return res.status(401).send('Access Denied');
        }

        if (req.user.walletAddress !== walletAddress) {
            return res.status(403).send('Forbidden');
        }

        const user = await User.findOneAndUpdate({ walletAddress: ignoreCase(walletAddress) }, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { walletAddress } = req.params;

        if (!req.user || !req.user.walletAddress) {
            return res.status(401).send('Access Denied');
        }

        if (req.user.walletAddress !== walletAddress) {
            return res.status(403).send('Forbidden');
        }

        const user = await User.findOneAndDelete({ walletAddress: ignoreCase(walletAddress) });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { walletAddress, signature } = req.body;

    if (!walletAddress || !signature) {
        return res.status(400).send('Wallet address and signature are required');
    }

    const message = `Login request for wallet: ${walletAddress}`;

    const signerAddress = verifyMessage(message, signature);

    if (signerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        return res.status(400).send('Invalid signature');
    }

    let user = await User.findOne({ walletAddress });
    if (!user) {
        user = new User({ walletAddress, userName: walletAddress });
        await user.save();
    }

    const token = jwt.sign({ _id: user._id, walletAddress: user.walletAddress }, process.env.TOKEN_SECRET_KEY as string, {
        expiresIn: '1h',
    });

    res.header('Authorization', `Bearer ${token}`).send({ token });
};

export const getUserChannels = async (req: AuthRequest, res: Response) => {
    try {
        // 获取当前用户的ID
        const userId = req.user?._id;

        // 查询当前用户作为成员的所有频道
        const channels = await Channel.find({ members: userId });

        res.status(200).send(channels);
    } catch (error) {
        res.status(500).send(error);
    }
};