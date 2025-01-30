import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { rateLimit } from "@/lib/rate-limit";

// Add paths that should bypass auth
const publicPaths = [
  "/api/auth/callback",
  "/api/auth/session",
  "/api/auth/signin",
  "/api/auth/signout",
  "/api/auth/_log",
  "/api/auth/providers",
  "/api/auth/error",
  "/login",
  "/auth",
];

export async function middleware(request: NextRequest) {
  // Check if the current path is public
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  try {
    // Apply rate limiting
    const limiter = await rateLimit(request);
    if (!limiter.success) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": limiter.retryAfter?.toString() || "60",
          },
        },
      );
    }

    // Check for auth token
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
        }),
        {
          status: 401,
        },
      );
    }

    // Verify token
    const decoded = await verifyToken(token);
    if (!decoded) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid token",
        }),
        {
          status: 401,
        },
      );
    }

    // Check email verification status for protected routes
    if (
      !decoded.emailVerified &&
      !request.nextUrl.pathname.startsWith("/api/auth/")
    ) {
      return new NextResponse(
        JSON.stringify({
          error: "Email not verified",
          code: "EMAIL_NOT_VERIFIED",
        }),
        {
          status: 403,
        },
      );
    }

    // Add user info to request
    request.headers.set("user", JSON.stringify(decoded));

    return NextResponse.next();
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: "Authentication failed",
      }),
      {
        status: 401,
      },
    );
  }
}

export const config = {
  matcher: [
    "/api/user/:path*",
    "/api/admin/:path*",
    "/((?!api/auth/|login|auth/).*)", // Exclude all auth-related paths
  ],
};
