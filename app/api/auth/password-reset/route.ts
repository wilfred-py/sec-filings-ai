import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/lib/auth-service";
import { rateLimit } from "@/lib/rate-limit";

// Request password reset
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const limiter = await rateLimit(request);
    if (!limiter.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { email } = await request.json();
    await AuthService.initiatePasswordReset(email);

    // Always return success (security best practice)
    return NextResponse.json({
      message: "If an account exists, a reset email has been sent",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}

// Reset password with token
export async function PUT(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    await AuthService.resetPassword(token, newPassword);

    return NextResponse.json({
      message: "Password successfully reset",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Invalid or expired reset token" },
      { status: 400 },
    );
  }
}
