import mongoose from 'mongoose';

const SecurityItemSchema = new mongoose.Schema({
  ticker: String,
  tickerName: String,
  addedAt: { type: Date, default: Date.now },
  customNotes: String,
  alertSettings: {
    priceThresholds: {
      upper: Number,
      lower: Number
    },
    filingTypes: [String]
  }
});

const WatchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  securities: [SecurityItemSchema],
  tags: [String]
}, { timestamps: true });

export default mongoose.models.Watchlist || mongoose.model('Watchlist', WatchlistSchema); 