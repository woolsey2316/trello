import mongoose, { Document, Schema } from 'mongoose';

export interface IList extends Document {
  name: string;
  cards: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ListSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    cards: [{ type: mongoose.Types.ObjectId, ref: 'Card' }],
  },
  { timestamps: true }
);

export default mongoose.model<IList>('List', ListSchema);
