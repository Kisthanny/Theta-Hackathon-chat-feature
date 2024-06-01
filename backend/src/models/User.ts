import { Document, Schema, model, Types } from 'mongoose'

interface IUser extends Document {
    walletAddress: string;
    userName: string;
    mutedChannels: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema: Schema<IUser> = new Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
    },
    mutedChannels: [{
        type: Schema.Types.ObjectId,
        ref: 'Channel'
    }]
}, { timestamps: true })

const User = model<IUser>('User', UserSchema);

export default User;