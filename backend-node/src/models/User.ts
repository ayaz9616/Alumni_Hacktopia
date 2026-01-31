import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username?: string;
  password_hash?: string;
  email?: string;
  google_id?: string;
  full_name?: string;
  profile_picture?: string;
  auth_type: 'traditional' | 'google';
  created_at: Date;
  last_login?: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, unique: true, sparse: true },
  password_hash: String,
  email: { type: String, unique: true, sparse: true },
  google_id: { type: String, unique: true, sparse: true },
  full_name: String,
  profile_picture: String,
  auth_type: { type: String, enum: ['traditional', 'google'], default: 'traditional' },
  created_at: { type: Date, default: Date.now },
  last_login: Date
});

export default mongoose.model<IUser>('User', UserSchema);
