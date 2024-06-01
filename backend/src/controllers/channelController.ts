import { Response } from 'express';
import Channel from '../models/Channel';
import User from '../models/User';
import { ignoreCase, AuthRequest } from './userController';
import { uniq } from "lodash";
import { Types } from "mongoose";

const isChannelOwner = async (userId: string, channelId: string): Promise<boolean> => {
    const channel = await Channel.findById(channelId);
    if (channel === null) {
        throw new Error(`Cannot find Channel by ID: ${channelId}`)
    }
    return channel && channel.owner.toString() === userId;
};

const validateMembershipInChannel = async (userId: Types.ObjectId, channelId: string): Promise<boolean> => {
    const channel = await Channel.findById(channelId);
    return channel ? channel.members.includes(userId) : false;
};

export const createChannel = async (req: AuthRequest, res: Response) => {
    try {
        const { name, type, isVoiceEnabled, owner = req.user?.walletAddress, members } = req.body;

        // expect members => walletAddress[], unsure case
        if (!members || !Array.isArray(members)) {
            return res.status(400).send({ error: 'Members must be a non-empty array of wallet addresses.' });
        }

        // validate if owner is sender
        const validateOwner = req.user?.walletAddress?.toLocaleLowerCase() === owner.toLocaleLowerCase();
        if (!validateOwner) {
            throw new Error(`User is not owner`)
        }

        // validate each walletAddress exist
        const uniqueMembers = uniq(members.concat([owner]).map(e => e.toLocaleLowerCase()))
        const validatedMembers = await Promise.all(uniqueMembers.map(async (address: string) => {
            const user = await User.findOne({ walletAddress: ignoreCase(address) });
            if (!user) {
                throw new Error(`User with walletAddress ${address} not found.`);
            }
            return user._id;
        }));

        // private channel requires 2 members
        if (type === "private") {
            if (validatedMembers.length !== 2) {
                throw new Error("private channel only support 2 members")
            }
        }

        // create channel
        const channel = new Channel({
            name,
            type,
            isVoiceEnabled,
            owner: req.user?._id,
            members: validatedMembers,
        });

        await channel.save();
        res.status(201).send(channel);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send({ error: error.message });
        } else {
            res.status(400).send({ error: 'An unknown error occurred.' });
        }
    }
};

export const getChannels = async (req: AuthRequest, res: Response) => {
    try {
        const channels = await Channel.find({}, { name: 1, type: 1, isVoiceEnabled: 1, createdAt: 1 })
        res.status(200).send(channels);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getChannel = async (req: AuthRequest, res: Response) => {
    try {
        const channel = await Channel.findById(req.params.id).populate("members", "walletAddress userName").populate("owner", "walletAddress userName");
        if (!channel) {
            return res.status(404).send();
        }
        res.status(200).send(channel);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateChannel = async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;
        const isOwner = await isChannelOwner(req.user?._id, req.params.id);
        if (!isOwner) {
            return res.status(403).send('Forbidden');
        }

        const updatedChannel = await Channel.findByIdAndUpdate(req.params.id, { name }, { new: true, runValidators: true });
        if (!updatedChannel) {
            return res.status(404).send();
        }
        res.status(200).send(updatedChannel);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteChannel = async (req: AuthRequest, res: Response) => {
    try {
        const isOwner = await isChannelOwner(req.user?._id, req.params.id);
        if (!isOwner) {
            return res.status(403).send('Forbidden');
        }

        const deletedChannel = await Channel.findByIdAndDelete(req.params.id);
        if (!deletedChannel) {
            return res.status(404).send();
        }
        res.status(200).send(deletedChannel);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const joinChannel = async (req: AuthRequest, res: Response) => {
    try {
        const channelId = req.params.id;

        // get channel
        const channel = await Channel.findById(channelId);
        if (!channel) {
            return res.status(404).send('Channel not found');
        }
        if (channel.type === 'private') {
            return res.status(404).send('Cannot join Private Channel')
        }

        // check if user is already a member
        if (channel.members.includes(req.user?._id)) {
            return res.status(400).send('User is already a member of this channel');
        }

        // add user._id to members
        channel.members.push(req.user?._id);
        await channel.save();

        res.status(200).send(channel);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const muteChannel = async (req: AuthRequest, res: Response) => {
    try {
        const channelId = req.params.channelId;
        const userId = req.user?._id;

        const isMember = await validateMembershipInChannel(userId, channelId);

        if (!isMember) {
            return res.status(403).send('You are not a member of this channel');
        }

        // 添加静音频道
        await User.findByIdAndUpdate(userId, { $addToSet: { mutedChannels: channelId } });

        res.status(200).send('Channel muted successfully');
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
};

export const unmuteChannel = async (req: AuthRequest, res: Response) => {
    try {
        const channelId = req.params.channelId;
        const userId = req.user?._id;

        const isMember = await validateMembershipInChannel(userId, channelId);

        if (!isMember) {
            return res.status(403).send('You are not a member of this channel');
        }

        // 移除静音频道
        await User.findByIdAndUpdate(userId, { $pull: { mutedChannels: channelId } });

        res.status(200).send('Channel unmuted successfully');
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
};
