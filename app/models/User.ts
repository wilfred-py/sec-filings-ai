import mongoose from 'mongoose';

const PreferencesSchema = new mongoose.Schema({
  emailFrequency: { type: String, enum: ['daily', 'weekly', 'realtime'], default: 'daily' },
  timezone: String,
  summaryFormat: { type: String, enum: ['detailed', 'concise'], default: 'detailed' },
  notificationPreferences: {
    newFilings: { type: Boolean, default: true },
    subscriptionAlerts: { type: Boolean, default: true },
    priceAlerts: { type: Boolean, default: true }
  }
});

const SubscriptionSchema = new mongoose.Schema({
  status: { type: String, enum: ['active', 'cancelled', 'past_due'], default: 'active' },
  plan: { type: String, enum: ['free', 'basic', 'premium'], default: 'free' },
  startDate: Date,
  endDate: Date,
  paymentMethod: {
    type: String,
    last4: String,
    expiryDate: String
  }
});

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: String,
  password: String,
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  preferences: PreferencesSchema,
  subscription: SubscriptionSchema
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema); 