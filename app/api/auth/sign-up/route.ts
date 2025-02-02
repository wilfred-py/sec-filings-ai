import { NextResponse } from "next/server";
import User from "@/app/models/User";
import connectDB from "@/lib/mongodb";
import crypto from "crypto";
import { EmailService } from "@/lib/email-service";

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
