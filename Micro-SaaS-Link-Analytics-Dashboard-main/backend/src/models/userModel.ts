import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
}

export interface IUserDoc extends IUser, Document {
  _id: mongoose.Types.ObjectId;
}

const UserSchema: Schema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  }
});

const User = mongoose.model<IUserDoc>('User', UserSchema);
export default User;
