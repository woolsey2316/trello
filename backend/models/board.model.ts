import mongoose, { Document, Schema } from 'mongoose';

export interface IBoard extends Document {
  name: string;
  description?: string;
  lists?: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    lists: [{ type: mongoose.Types.ObjectId, ref: 'List' }],
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBoard>('Board', BoardSchema);
