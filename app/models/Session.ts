import mongoose from "mongoose";
import User from "@/app/models/User";

export interface ISession extends mongoose.Document {
  id: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  user?: typeof User;
}

const SessionSchema = new mongoose.Schema<ISession>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// Create an index for faster lookups by id
SessionSchema.index({ id: 1 }, { unique: true });
// Create an index for expiration queries
SessionSchema.index({ expiresAt: 1 });

export const Session =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);

export default Session;
