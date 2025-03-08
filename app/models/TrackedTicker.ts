import mongoose, { Schema } from "mongoose";

const TrackedTickerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  ticker: { type: String, required: true },
  tags: [{ type: String }],
});

TrackedTickerSchema.index({ userId: 1, ticker: 1 }, { unique: true });

export default mongoose.models.TrackedTicker ||
  mongoose.model("TrackedTicker", TrackedTickerSchema);
