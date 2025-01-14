import mongoose from 'mongoose';

const AnalysisQueueSchema = new mongoose.Schema({
  securityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Security', required: true },
  ticker: { type: String, required: true },
  filingType: { type: String, required: true },
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
  resultCacheId: { type: mongoose.Schema.Types.ObjectId, ref: 'FilingCache' }
}, { 
  timestamps: true,
  index: { 
    priority: -1, 
    createdAt: 1,
    status: 1 
  }
});

// Add compound index for queue processing
AnalysisQueueSchema.index({ status: 1, priority: -1, createdAt: 1 });

export default mongoose.models.AnalysisQueue || mongoose.model('AnalysisQueue', AnalysisQueueSchema); 