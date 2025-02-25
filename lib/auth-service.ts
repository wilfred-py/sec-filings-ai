import { User } from "@/app/models/User";
import { generateToken } from "@/lib/jwt";

export class AuthService {
  // Login with rate limiting and account locking
  static async authenticateUser(email: string, password: string) {
    const user = await User.findOne({ email });

    // Check if user exists and isn't locked
    if (!user || (user.lockUntil && user.lockUntil > new Date())) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Increment failed attempts
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Lock account after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }

      await user.save();
      throw new Error("Invalid credentials");
    }

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    return generateToken(user);
  }

  // Register new user
  static async registerUser(userData: {
    email: string;
    password: string;
    roles?: string[];
  }) {
    // Validate email format
    if (!userData.email || !userData.email.includes("@")) {
      throw new Error("Invalid email format");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Create new user with default role
    const user = new User({
      ...userData,
      roles: userData.roles || ["user"],
      createdAt: new Date(),
      emailVerified: false,
    });

    // Generate verification token
    const verificationToken = await user.generateEmailVerification();
    await user.save();

    return { user, verificationToken };
  }

  // Password reset request
  static async initiatePasswordReset(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user not found (security best practice)
      return true;
    }

    await user.generatePasswordReset();
    return user.resetPasswordToken;
  }

  // Validate reset token and update password
  static async resetPassword(token: string, newPassword: string) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.lastPasswordChange = new Date();
    await user.save();

    return true;
  }
}
