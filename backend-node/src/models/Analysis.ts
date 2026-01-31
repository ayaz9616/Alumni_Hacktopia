import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysis extends Document {
  user_id: string;
  resume_hash: string;
  jd_hash: string;
  provider: string;
  model_name: string;
  intensity: string;
  result_json: any;
  created_at: Date;
}

const AnalysisSchema: Schema = new Schema({
  user_id: { type: String, required: true },
  resume_hash: { type: String, required: true },
  jd_hash: { type: String, required: true },
  provider: String,
  model_name: String,
  intensity: String,
  result_json: Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now }
});

// Create compound unique index
AnalysisSchema.index({ 
  user_id: 1, 
  resume_hash: 1, 
  jd_hash: 1, 
  provider: 1, 
  model_name: 1, 
  intensity: 1 
}, { unique: true });

export default mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
