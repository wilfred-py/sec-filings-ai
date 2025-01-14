import mongoose from 'mongoose';

const AppliedTagSchema = new mongoose.Schema({
  securityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Security', required: true },
  appliedAt: { type: Date, default: Date.now }
});

const UserTagSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v: string) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Color must be a valid hex code'
    }
  },
  description: String,
  appliedTo: [AppliedTagSchema]
}, { 
  timestamps: true 
});

// Add indexes for quick tag lookups
UserTagSchema.index({ userId: 1, name: 1 }, { unique: true });
UserTagSchema.index({ 'appliedTo.securityId': 1 });

export default mongoose.models.UserTag || mongoose.model('UserTag', UserTagSchema); 