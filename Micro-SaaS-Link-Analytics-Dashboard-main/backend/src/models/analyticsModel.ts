import mongoose, { Document, Schema } from 'mongoose';

export interface IClickAnalytics extends Document {
  shortLinkId: mongoose.Types.ObjectId;
  timestamp: Date;
  ip?: string;
  device?: string;
  browser?: string;
  location?: string;
}

const ClickAnalyticsSchema: Schema = new Schema<IClickAnalytics>({
  shortLinkId: { 
    type: Schema.Types.ObjectId, 
    ref: 'ShortLink', 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  ip: String,
  device: String,
  browser: String,
  location: String
});

const ClickAnalytics = mongoose.model<IClickAnalytics>('ClickAnalytics', ClickAnalyticsSchema);
export default ClickAnalytics;
