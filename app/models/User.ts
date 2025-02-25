import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import isEmail from "validator/lib/isEmail";
import { randomBytes } from "crypto";

// Add these new types before IUser interface
type OAuthProvider = "google" | "x" | "github";

interface IOAuthProfile {
  provider: OAuthProvider;
  providerId: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface IUser extends mongoose.Document {
  email: string;
  password?: string; // Make password optional since OAuth users won't have one
  oauthProfiles?: IOAuthProfile[];
  roles: string[];
  subscribedTickers: string[];
  createdAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  isActive: boolean;
  emailVerified: boolean;
  verificationToken?: string | null;
  lastPasswordChange?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;
  gdprConsent: {
    accepted: boolean;
    date: Date;
  };
  dataRetentionApproved: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordReset(): Promise<void>;
  generateEmailVerification(): Promise<string>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [
        function (this: IUser) {
          // Email is required only if no OAuth profiles exist
          return !this.oauthProfiles || this.oauthProfiles.length === 0;
        },
        "Email is required",
      ],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => !email || isEmail(email), // Allow empty email for OAuth
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: function (this: IUser) {
        // Password is required only if no OAuth profiles exist
        return !this.oauthProfiles || this.oauthProfiles.length === 0;
      },
      minlength: [8, "Password must be at least 8 characters long"],
    },
    oauthProfiles: [
      {
        provider: {
          type: String,
          enum: ["google", "x", "github"],
          required: true,
        },
        providerId: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: false,
        },
        displayName: String,
        photoURL: String,
        accessToken: String,
        refreshToken: String,
      },
    ],
    roles: {
      type: [String],
      enum: ["user", "admin"],
      default: ["user"],
    },
    subscribedTickers: [
      {
        type: String,
        trim: true,
        uppercase: true,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    lastPasswordChange: Date,
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    gdprConsent: {
      accepted: { type: Boolean, default: false },
      date: Date,
    },
    dataRetentionApproved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

// Index for performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ resetPasswordToken: 1 }, { sparse: true });

// Add index for OAuth lookups
UserSchema.index({
  "oauthProfiles.provider": 1,
  "oauthProfiles.providerId": 1,
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Add methods for password reset and email verification
UserSchema.methods.generatePasswordReset = async function () {
  this.resetPasswordToken = randomBytes(32).toString("hex");
  this.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  await this.save();
};

UserSchema.methods.generateEmailVerification = async function () {
  const token = randomBytes(32).toString("hex");
  this.verificationToken = token;
  await this.save();
  return token;
};

// Add these methods before the model export
UserSchema.methods.addOAuthProfile = async function (profile: IOAuthProfile) {
  const existingProfile = this.oauthProfiles?.find(
    (p: IOAuthProfile) => p.provider === profile.provider,
  );

  if (existingProfile) {
    Object.assign(existingProfile, profile);
  } else {
    if (!this.oauthProfiles) {
      this.oauthProfiles = [];
    }
    this.oauthProfiles.push(profile);
  }

  await this.save();
};

UserSchema.methods.removeOAuthProfile = async function (
  provider: OAuthProvider,
) {
  if (this.oauthProfiles) {
    this.oauthProfiles = this.oauthProfiles.filter(
      (p: IOAuthProfile) => p.provider !== provider,
    );
    await this.save();
  }
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
