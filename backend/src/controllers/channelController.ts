import { Request, Response } from 'express';
import Channel from '../models/Channel';

export const createChannel = async (req: Request, res: Response) => {
    try {
        const channel = new Channel(req.body);
        await channel.save();
        res.status(201).send(channel);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getChannels = async (req: Request, res: Response) => {
    try {
        const channels = await Channel.find();
        res.status(200).send(channels);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getChannel = async (req: Request, res: Response) => {
    try {
        const channel = await Channel.findById(req.params.id);
        if (!channel) {
            return res.status(404).send();
        }
        res.status(200).send(channel);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateChannel = async (req: Request, res: Response) => {
    try {
        const channel = await Channel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!channel) {
            return res.status(404).send();
        }
        res.status(200).send(channel);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteChannel = async (req: Request, res: Response) => {
    try {
        const channel = await Channel.findByIdAndDelete(req.params.id);
        if (!channel) {
            return res.status(404).send();
        }
        res.status(200).send(channel);
    } catch (error) {
        res.status(500).send(error);
    }
};
