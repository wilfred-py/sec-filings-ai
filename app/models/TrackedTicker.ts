import mongoose, { Schema } from "mongoose";

const TrackedTickerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  ticker: { type: String, required: true, uppercase: true, trim: true },
  tags: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
});
TrackedTickerSchema.index({ userId: 1, ticker: 1 }, { unique: true });
TrackedTickerSchema.index({ userId: 1 });
TrackedTickerSchema.index({ ticker: 1 });

export default mongoose.models.TrackedTicker ||
  mongoose.model("TrackedTicker", TrackedTickerSchema);
