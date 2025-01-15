import mongoose from 'mongoose';

// Separate schemas for different filing types
const FinancialSchema = new mongoose.Schema({
  label: String,
  value: String,
  growth: String,
  unit: String
});

const ImpactItemSchema = new mongoose.Schema({
  headline: String,
  source: String,
  section: String,
  impact: String
});

const TransactionSchema = new mongoose.Schema({
  type: String,
  shares: Number,
  price: Number,
  totalValue: Number,
  transactionCode: String,
  ownership: String,
  date: Date
});

const FilingCacheSchema = new mongoose.Schema({
  securityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Security', required: true },
  ticker: { type: String, required: true },
  filingType: { 
    type: String, 
    enum: ['10-K', '10-Q', '8-K', 'FORM-4'],
    required: true 
  },
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
  
  rawAnalysis: String,
  
  structuredAnalysis: {
    periodicalFiling: {
      company: String,
      period: String,
      financials: [FinancialSchema],
      insights: [String],
      risks: [String],
      upsideOpportunities: [ImpactItemSchema],
      riskFactors: [ImpactItemSchema]
    },
    
    currentReport: {
      company: String,
      reportDate: String,
      eventType: String,
      summary: String,
      positiveDevelopments: [ImpactItemSchema],
      potentialConcerns: [ImpactItemSchema],
      structuralChanges: [ImpactItemSchema],
      additionalNotes: String
    },
    
    insiderFiling: {
      company: String,
      filingDate: String,
      filerName: String,
      relationship: String,
      ownershipType: String,
      totalValue: String,
      percentageChange: String,
      previousStake: String,
      newStake: String,
      summary: String,
      transactions: [TransactionSchema],
      contextualNotes: {
        is10b51Plan: Boolean,
        unusualTiming: Boolean,
        partOfPattern: Boolean,
        nearCorporateEvent: Boolean,
        specialConditions: [String]
      }
    }
  },
  
  metadata: {
    analyzedAt: Date,
    modelVersion: String,
    confidenceScore: Number,
    llmCost: Number,
    processingTimeMs: Number
  }
}, { timestamps: true });

// Add indexes
FilingCacheSchema.index({ ticker: 1, filingType: 1, filingDate: -1 });
FilingCacheSchema.index({ cacheExpiry: 1 }, { expireAfterSeconds: 0 });
FilingCacheSchema.index({ securityId: 1, filingType: 1 });

export default mongoose.models.FilingCache || mongoose.model('FilingCache', FilingCacheSchema); 