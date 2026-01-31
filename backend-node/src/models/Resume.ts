import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  user_id: string;
  filename: string;
  resume_hash: string;
  resume_text: string;
  created_at: Date;
}

const ResumeSchema: Schema = new Schema({
  user_id: { type: String, required: true },
  filename: String,
  resume_hash: { type: String, required: true },
  resume_text: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// Create compound unique index
ResumeSchema.index({ user_id: 1, resume_hash: 1 }, { unique: true });

export default mongoose.model<IResume>('Resume', ResumeSchema);
