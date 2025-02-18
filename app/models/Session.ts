import mongoose from "mongoose";
import { IUser } from "@/app/models/User";

export interface ISession extends mongoose.Document {
  id: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  user?: IUser;
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

export const Session =
  mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);
