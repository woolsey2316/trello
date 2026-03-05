import mongoose, { Document, Schema } from 'mongoose';

export interface IChecklistItem {
  _id?: mongoose.Types.ObjectId;
  text: string;
  done: boolean;
}

export interface ICard extends Document {
  title: string;
  description?: string;
  attachmentPath?: string;
  assignedTo?: mongoose.Types.ObjectId[];
  labels?: string[];
  dueDate?: Date;
  checklist?: IChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistItemSchema = new Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
});

const LabelSchema = new Schema({
  value: { type: String, required: true },
  colourClass: { type: String, required: true },
  text: { type: String },
  textColor: { type: String },
});

const CardSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    attachmentPath: { type: String },
    assignedTo: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    labels: [LabelSchema],
    dueDate: { type: Date },
    checklist: [ChecklistItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<ICard>('Card', CardSchema);
