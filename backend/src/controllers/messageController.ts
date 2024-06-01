import { Response } from 'express';
import Message from '../models/Message';
import { AuthRequest } from "./userController";
import Channel from '../models/Channel';
import { Types } from 'mongoose';

const validateMembershipInChannel = async (userId: Types.ObjectId, channelId: string) => {
    try {
        if (!userId) { return false; }

        const channel = await Channel.findById(channelId);

        if (!channel) { return false; }

        return channel.members.includes(userId);
    } catch (error) {
        console.error('Error validating membership:', error);
        return false;
    }
};

export const createMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { channel, content, image } = req.body;

        const validateMembership = await validateMembershipInChannel(req.user?._id, channel)
        if (!validateMembership) {
            return res.status(403).send('You are not a member of this channel');
        }

        const message = new Message({ sender: req.user?._id, channel, content, image });
        await message.save();

        res.status(201).send(message);
    } catch (error) {
        res.status(400).send((error as Error).message);
    }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const { channelId, size, page } = req.params;
        const pageSize = parseInt(size);
        const pageNumber = parseInt(page);

        const validateMembership = await validateMembershipInChannel(req.user?._id, channelId)
        if (!validateMembership) {
            return res.status(403).send('You are not a member of this channel');
        }

        const messages = await Message.find({ channel: channelId }, { sender: 1, channel: 1, content: 1, image: 1, createdAt: 1 })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({ createdAt: -1 })
            .populate("sender", "walletAddress userName");

        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
};

export const recallMessage = async (req: AuthRequest, res: Response) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).send('Message not found');
        }

        if (message.sender.toString() !== req.user?._id) {
            return res.status(403).send('Forbidden')
        }

        const channelId = message.channel?.toString();
        const channel = await Channel.findById(channelId);
        if (!channelId || !channel) {
            return res.status(404).send('Channel not found');
        }

        const validateMembership = await validateMembershipInChannel(req.user?._id, channelId)
        if (!validateMembership) {
            return res.status(403).send('You are not a member of this channel');
        }

        const now = new Date();
        if (!message.createdAt) {
            return res.status(403).send('Cannot recall this message');
        }
        const messageTime = new Date(message.createdAt);
        const timeDiff = (now.getTime() - messageTime.getTime()) / 1000; // Time difference in seconds

        if (timeDiff > 120) { // Check if message creation time is greater than 2 minutes
            return res.status(403).send('Cannot recall messages created more than 2 minutes ago');
        }

        await Message.findByIdAndDelete(messageId);
        res.status(200).send('Message recalled successfully');
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
};