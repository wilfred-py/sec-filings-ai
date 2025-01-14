import mongoose from 'mongoose';

const SecurityItemSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
  customNotes: String,
  alertSettings: {
    priceThresholds: {
      upper: Number,
      lower: Number
    },
    filingTypes: {
      type: [String],
      enum: ['10-K', '10-Q', '8-K', 'Form 4']
    }
  },
  lastNotifiedFilingId: { type: mongoose.Schema.Types.ObjectId, ref: 'FilingCache' }
});

const WatchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  securities: [SecurityItemSchema],
  tags: [String]
}, { timestamps: true });

export default mongoose.models.Watchlist || mongoose.model('Watchlist', WatchlistSchema); 