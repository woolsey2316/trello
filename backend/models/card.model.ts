import mongoose, { Document, Schema } from 'mongoose';

export interface ICard extends Document {
  title: string;
  description?: string;
  attachmentPath?: string;
  assignedTo?: mongoose.Types.ObjectId[];
  LabelIds?: mongoose.Types.ObjectId[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CardSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    attachmentPath: { type: String },
    assignedTo: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    LabelIds: [{ type: mongoose.Types.ObjectId, ref: 'Label' }],
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<ICard>('Card', CardSchema);
