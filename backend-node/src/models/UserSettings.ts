import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSettings extends Document {
  user_id: string;
  settings: {
    provider?: string;
    api_key?: string;
    model?: string;
    ollama_base_url?: string;
    ollama_model?: string;
  };
  updated_at: Date;
}

const UserSettingsSchema: Schema = new Schema({
  user_id: { type: String, required: true, unique: true },
  settings: {
    provider: String,
    api_key: String,
    model: String,
    ollama_base_url: String,
    ollama_model: String
  },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema);
