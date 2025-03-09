import mongoose, { Schema } from "mongoose";

interface IPasswordReset extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
PasswordResetSchema.index({ userId: 1, token: 1 }, { unique: true });

export default mongoose.models.PasswordReset ||
  mongoose.model("PasswordReset", PasswordResetSchema);
