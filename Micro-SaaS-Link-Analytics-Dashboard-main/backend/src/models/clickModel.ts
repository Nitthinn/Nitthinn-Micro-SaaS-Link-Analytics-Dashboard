import mongoose, { Document, Schema } from 'mongoose';

export interface IClick extends Document {
  userId: mongoose.Types.ObjectId;
  shortUrl: string;
  clickedAt: Date;
  device?: string;
  browser?: string;
}

const clickSchema: Schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shortUrl: { type: String, required: true },
  clickedAt: { type: Date, default: Date.now },
  device: { type: String },
  browser: { type: String },
});

const Click = mongoose.model<IClick>('Click', clickSchema);
export default Click;
