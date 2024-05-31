import { Document, Schema, model, Types } from 'mongoose';

interface IMessage extends Document {
    sender: Types.ObjectId;
    channel?: Types.ObjectId;
    receiver?: Types.ObjectId;
    content?: string;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const MessageSchema: Schema<IMessage> = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: 'Channel',
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    content: {
        type: String,
    },
    image: {
        type: String,
    }
}, { timestamps: true });

MessageSchema.pre('validate', function (next) {
    if (!this.channel && !this.receiver) {
        next(new Error('Either channel or receiver must be specified.'));
    } else if (this.channel && this.receiver) {
        next(new Error('Channel and receiver cannot both be specified.'));
    } else if (!this.content && !this.image) {
        next(new Error('Either content or image must be specified.'));
    } else if (this.content && this.image) {
        next(new Error('Content and image cannot both be specified.'));
    } else {
        next();
    }
});

const Message = model<IMessage>('Message', MessageSchema);
export default Message;
