import { Document, Schema, model, Types } from 'mongoose';

export interface IMessage extends Document {
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
    content: {
        type: String,
    },
    image: {
        type: String,
    }
}, { timestamps: true });

MessageSchema.pre('validate', function (next) {
    if (!this.content && !this.image) {
        next(new Error('Either content or image must be specified.'));
    } else if (this.content && this.image) {
        next(new Error('Content and image cannot both be specified.'));
    } else {
        next();
    }
});

const Message = model<IMessage>('Message', MessageSchema);
export default Message;
