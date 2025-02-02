import { NextResponse } from "next/server";
import { User } from "@/app/models";
import type { IUser } from "@/app/models/User";
import connectDB from "@/lib/mongodb";

export async function GET(request: Request) {
  let token: string | null = null;
  let user: IUser | null = null;

  try {
    await connectDB();

    // Get token from URL
    const { searchParams } = new URL(request.url);
    token = searchParams.get("token");

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
    user = await User.findOne({ verificationToken: token });

    console.log("user", user);

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
    user.verificationToken = null;
    await user.save();

    return NextResponse.redirect(new URL("/email-verified", request.url));
  } catch (error) {
    console.error("Email verification error:", {
      error,
      token,
      userId: user?._id,
    });
    return NextResponse.json(
      { error: "Email verification failed" },
      { status: 500 },
    );
  }
}
