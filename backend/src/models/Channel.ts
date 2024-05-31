import { Document, Schema, Types, model } from 'mongoose';

interface IChannel extends Document {
    name: string;
    type: 'world' | 'group' | 'private';
    isVoiceEnabled: boolean;
    members: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const ChannelSchema: Schema<IChannel> = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['world', 'group', 'private'],
        required: true,
    },
    isVoiceEnabled: {
        type: Boolean,
        default: false,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
}, { timestamps: true });

const Channel = model<IChannel>('Channel', ChannelSchema);
export default Channel;
