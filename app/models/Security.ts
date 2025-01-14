import mongoose from 'mongoose';

const SecuritySchema = new mongoose.Schema({
  ticker: { type: String, required: true, unique: true },
  companyName: String,
  industry: String,
  sector: String,
  lastUpdated: Date,
  metadata: {
    exchange: String,
    cik: String,
    fiscalYearEnd: String
  },
  customTags: [{
    name: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  subscriberCount: { type: Number, default: 0 },
  latestFilingAnalysisId: { type: mongoose.Schema.Types.ObjectId, ref: 'FilingCache' }
});

SecuritySchema.index({ ticker: 1, 'metadata.cik': 1 });

export default mongoose.models.Security || mongoose.model('Security', SecuritySchema); 