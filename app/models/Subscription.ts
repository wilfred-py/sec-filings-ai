import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';

export interface ISubscription extends mongoose.Document {
  email: string;
  status: 'pending' | 'confirmed';
  createdAt: Date;
  confirmationToken?: string;
  confirmationExpires?: Date;
}

const SubscriptionSchema = new mongoose.Schema<ISubscription>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email: string) {
        return isEmail(email);
      },
      message: 'Please enter a valid email'
    },
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed'],
    default: 'pending'
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  confirmationToken: String,
  confirmationExpires: Date
});

// Add indexes for common queries
SubscriptionSchema.index({ email: 1, status: 1 });
SubscriptionSchema.index({ confirmationToken: 1 }, { sparse: true });

export default mongoose.models.Subscription || 
  mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
