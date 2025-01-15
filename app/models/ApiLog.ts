import mongoose from 'mongoose';

const ApiLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  endpoint: { type: String, required: true },
  status: { type: Number, required: true },
  duration: { type: Number, required: true }, // in milliseconds
  error: String,
  metadata: {
    userAgent: String,
    ip: String,
    cacheHit: { type: Boolean, default: false },
    llmCost: { type: Number, default: 0 }
  }
}, { 
  timestamps: false // Using explicit timestamp field
});

// Add indexes for monitoring and analytics
ApiLogSchema.index({ timestamp: -1 });
ApiLogSchema.index({ userId: 1, timestamp: -1 });
ApiLogSchema.index({ endpoint: 1, status: 1 });
ApiLogSchema.index({ 
  timestamp: 1 
}, { 
  expireAfterSeconds: 30 * 24 * 60 * 60 // Auto-delete after 30 days
});

export default mongoose.models.ApiLog || mongoose.model('ApiLog', ApiLogSchema); 