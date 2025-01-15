import mongoose from 'mongoose';

const PromptVersionSchema = new mongoose.Schema({
  version: { type: String, required: true },
  filingType: { 
    type: String,
    enum: ['10-K', '10-Q', '8-K', 'FORM-4'],
    required: true 
  },
  promptText: { type: String, required: true },
  active: { type: Boolean, default: true },
  metadata: {
    author: String,
    description: String,
    changes: String
  },
  performance: {
    averageProcessingTime: Number,
    averageCost: Number,
    successRate: Number,
    lastUpdated: Date
  }
}, { 
  timestamps: true,
  index: { 
    version: 1,
    filingType: 1 
  }
});

// Ensure unique version per filing type
PromptVersionSchema.index({ version: 1, filingType: 1 }, { unique: true });

export default mongoose.models.PromptVersion || mongoose.model('PromptVersion', PromptVersionSchema); 