import mongoose from 'mongoose';
import isEmail from 'validator/lib/isEmail';

export interface ISubscription extends mongoose.Document {
  email: string;
  status: 'active' | 'cancelled' | 'past_due';
  plan: 'free' | 'premium';
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  paymentMethod: {
    type: string;
    last4: string;
    expiryDate: string;
  };
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
  status: { type: String, enum: ['active', 'cancelled', 'past_due'], default: 'active' },
  plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  startDate: Date,
  endDate: Date,
  paymentMethod: {
    type: String,
    last4: String,
    expiryDate: String
  },
  confirmationToken: String,
  confirmationExpires: Date
}, {collection: "subscriptions"});

// Add indexes for common queries
SubscriptionSchema.index({ email: 1, status: 1 });
SubscriptionSchema.index({ confirmationToken: 1 }, { sparse: true });

export default mongoose.models.Subscription || 
  mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
