import mongoose, { Document, Schema } from 'mongoose';

export interface IBoard extends Document {
  name: string;
  description?: string;
  lists?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    lists: [{ type: mongoose.Types.ObjectId, ref: 'List' }],
  },
  { timestamps: true }
);

export default mongoose.model<IBoard>('Board', BoardSchema);
