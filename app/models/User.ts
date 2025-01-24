import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import isEmail from 'validator/lib/isEmail';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  roles: string[];
  subscribedTickers: string[];
  createdAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  isActive: boolean;
  emailVerified: boolean;
  verificationToken: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (email: string) => isEmail(email),
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  roles: {
    type: [String],
    enum: ['user', 'admin'],
    default: ['user']
  },
  subscribedTickers: [{
    type: String,
    trim: true,
    uppercase: true
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Index for performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ resetPasswordToken: 1 }, { sparse: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);