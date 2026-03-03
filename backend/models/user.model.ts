import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  googleId?: string;
  boardIds: mongoose.Types.ObjectId[];
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    googleId: { type: String },
    boardIds: [{ type: mongoose.Types.ObjectId, ref: 'Board' }],
    hashedPassword: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
