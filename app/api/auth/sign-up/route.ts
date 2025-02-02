import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { generateToken } from "@/lib/jwt";
import WelcomeEmail from "@/app/emails/WelcomeEmail";
import connectDB from "@/lib/mongodb";
import { Resend } from "resend";
import crypto from "crypto";
import { EmailService } from "@/lib/email-service";

const resend = new Resend(process.env.RESEND_API_KEY);

// Utility function for exponential backoff with jitter
function calculateBackoff(attempt: number, baseDelay = 1000, maxDelay = 10000) {
  // Calculate exponential backoff: 2^attempt * baseDelay
  const exponentialDelay = Math.min(
    baseDelay * Math.pow(2, attempt - 1),
    maxDelay,
  );
  // Add random jitter (±10%) to prevent thundering herd
  const jitter = exponentialDelay * 0.1 * (Math.random() * 2 - 1);
  return exponentialDelay + jitter;
}

async function sendEmailWithRetry(
  email: string,
  verificationToken: string,
  maxRetries = 3,
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await resend.emails.send({
        from: "tldrSEC <noreply@waitlist.tldrsec.app>",
        to: email,
        subject: "Welcome to tldrSEC Waitlist!",
        react: WelcomeEmail({ token: verificationToken }),
      });
      return;
    } catch (error) {
      console.error(`Email attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) throw error;

      const backoffTime = calculateBackoff(attempt);
      await new Promise((resolve) => setTimeout(resolve, backoffTime));
    }
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const user = await User.create({
      email,
      password,
      roles: ["user"],
      emailVerified: false,
      verificationToken,
    });

    // Use EmailService instead of direct email sending
    try {
      await EmailService.sendWelcomeEmail(email, verificationToken);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Optionally delete the user if email fails
      await User.findByIdAndDelete(user._id);
      throw emailError;
    }

    return NextResponse.json(
      {
        message:
          "Registration successful. Please check your email to verify your account.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    // Add more specific error messages based on error type
    const errorMessage =
      error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json(
      {
        error: errorMessage,
      },
      {
        status: 500,
      },
    );
  }
}
