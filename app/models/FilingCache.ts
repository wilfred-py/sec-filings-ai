import mongoose from 'mongoose';

const FilingCacheSchema = new mongoose.Schema({
  securityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Security', required: true },
  ticker: { type: String, required: true },
  filingType: { type: String, required: true },
  filingDate: { type: Date, required: true },
  documentUrl: String,
  sourceHash: { type: String, required: true },
  cacheStatus: { 
    type: String, 
    enum: ['processing', 'ready', 'error'],
    required: true 
  },
  cacheExpiry: { type: Date, required: true },
  processingStarted: Date,
  lastAccessed: Date,
  accessCount: { type: Number, default: 0 },
  analysis: {
    summary: String,
    keyPoints: [String],
    riskFactors: [String],
    financialHighlights: {
      revenue: Number,
      netIncome: Number,
      eps: Number
    },
    sentiment: {
      score: Number,
      keyFactors: [String]
    }
  },
  metadata: {
    analyzedAt: Date,
    modelVersion: String,
    confidenceScore: Number,
    llmCost: Number
  }
}, { timestamps: true });

// Add indexes for frequent queries
FilingCacheSchema.index({ ticker: 1, filingType: 1, filingDate: -1 });
FilingCacheSchema.index({ cacheExpiry: 1 }, { expireAfterSeconds: 0 }); // TTL index

export default mongoose.models.FilingCache || mongoose.model('FilingCache', FilingCacheSchema); 