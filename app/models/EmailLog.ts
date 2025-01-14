import mongoose from 'mongoose';

const EmailLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sentAt: { type: Date, default: Date.now },
  type: { 
    type: String, 
    enum: ['summary', 'alert', 'system'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['sent', 'failed', 'delivered'],
    required: true 
  },
  content: {
    subject: String,
    filingCacheIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FilingCache' }],
    errorMessage: String
  }
}, { 
  timestamps: true 
});

// Add indexes for querying email history and status
EmailLogSchema.index({ userId: 1, sentAt: -1 });
EmailLogSchema.index({ status: 1, type: 1 });

export default mongoose.models.EmailLog || mongoose.model('EmailLog', EmailLogSchema); 