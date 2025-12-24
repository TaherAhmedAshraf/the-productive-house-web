import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    uid: string; // Firebase UID
    email: string;
    displayName?: string;
    photoURL?: string;
    role: 'user' | 'admin';
    wishlist: string[];
}

const UserSchema: Schema = new Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String },
    photoURL: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, {
    timestamps: true
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
