import { Document, Schema, Types, model } from 'mongoose';

interface IChannel extends Document {
    address: string | undefined;
    name: string;
    type: 'world' | 'group' | 'private';
    isVoiceEnabled: boolean;
    owner: Types.ObjectId;
    members: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const ChannelSchema: Schema<IChannel> = new Schema({
    address: {
        type: String,
        unique: true,
    },
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
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }]
}, { timestamps: true });

const Channel = model<IChannel>('Channel', ChannelSchema);
export default Channel;
