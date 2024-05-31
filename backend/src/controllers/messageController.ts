import { Request, Response } from 'express';
import Message from '../models/Message';

export const createMessage = async (req: Request, res: Response) => {
    try {
        const message = new Message(req.body);
        await message.save();
        res.status(201).send(message);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const messages = await Message.find();
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getMessage = async (req: Request, res: Response) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).send();
        }
        res.status(200).send(message);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updateMessage = async (req: Request, res: Response) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!message) {
            return res.status(404).send();
        }
        res.status(200).send(message);
    } catch (error) {
        res.status(400).send(error);
    }
};

export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);
        if (!message) {
            return res.status(404).send();
        }
        res.status(200).send(message);
    } catch (error) {
        res.status(500).send(error);
    }
};
