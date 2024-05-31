import { Document, Schema, model } from 'mongoose'

interface IUser extends Document {
    walletAddress: string;
    userName: string;
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
}, { timestamps: true })

const User = model<IUser>('User', UserSchema);

export default User;