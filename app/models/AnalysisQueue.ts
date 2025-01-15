import mongoose from 'mongoose';

const AnalysisQueueSchema = new mongoose.Schema({
  securityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Security', required: true },
  ticker: { type: String, required: true },
  filingType: { 
    type: String,
    enum: ['10-K', '10-Q', '8-K', 'FORM-4'],
    required: true 
  },
  filingUrl: { type: String, required: true },
  priority: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'],
    required: true,
    default: 'pending'
  },
  attempts: { type: Number, default: 0 },
  lastError: String,
  processingStarted: Date,
  processingCompleted: Date,
  resultCacheId: { type: mongoose.Schema.Types.ObjectId, ref: 'FilingCache' },
  
  analysisConfig: {
    promptVersion: { type: String, required: true },
    modelParameters: {
      model: { 
        type: String,
        enum: ['grok', 'gpt4', 'claude'],
        required: true 
      },
      temperature: { type: Number, min: 0, max: 2 },
      maxTokens: { type: Number, min: 1 }
    },
    customPromptOverrides: {
      enabled: { type: Boolean, default: false },
      prompt: String
    }
  }
}, { timestamps: true });

AnalysisQueueSchema.index({ status: 1, priority: -1, createdAt: 1 });
AnalysisQueueSchema.index({ ticker: 1, filingType: 1 });

export default mongoose.models.AnalysisQueue || mongoose.model('AnalysisQueue', AnalysisQueueSchema); 