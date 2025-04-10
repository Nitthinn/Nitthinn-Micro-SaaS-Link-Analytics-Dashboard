import mongoose, { Document, Schema } from 'mongoose';

export interface IShortLink extends Document {
  userId: mongoose.Types.ObjectId;
  originalUrl: string;
  shortCode: string;
  customAlias?: string;
  createdAt: Date;
  expirationDate?: Date;
  totalClicks: number;
}

const ShortLinkSchema: Schema = new Schema<IShortLink>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  originalUrl: { 
    type: String, 
    required: true,
    trim: true
  },
  shortCode: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  customAlias: { 
    type: String,
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  expirationDate: Date,
  totalClicks: { 
    type: Number, 
    default: 0 
  }
});

const ShortLink = mongoose.model<IShortLink>('ShortLink', ShortLinkSchema);
export default ShortLink;
