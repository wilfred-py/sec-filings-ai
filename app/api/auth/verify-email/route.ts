import { NextResponse } from "next/server";
import { User } from "@/app/models";
import connectDB from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    await connectDB();

    // Get token from URL
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          error: "Verification token is required",
        },
        {
          status: 400,
        },
      );
    }

    // Find user with matching verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid verification token",
        },
        {
          status: 404,
        },
      );
    }

    // Update user's emailVerified status
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.redirect(new URL("/email-verified", request.url));
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Email verification failed" },
      { status: 500 },
    );
  }
}
