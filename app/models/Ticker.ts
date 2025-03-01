import mongoose, { Schema } from "mongoose";

const TickerSchema = new Schema({
  ticker: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

TickerSchema.index({ ticker: "text", name: "text" });

export default mongoose.models.Ticker || mongoose.model("Ticker", TickerSchema);
