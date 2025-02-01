// middleware/auth.ts
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

// Role-protected paths configuration
const roleProtectedPaths = {
  "/api/admin": ["admin"],
  "/api/user": ["user", "admin"],
  // Add more role-protected paths as needed
};

export async function middleware(request: NextRequest) {
  // Check if path should bypass middleware
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
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": limiter.retryAfter?.toString() || "60",
        },
      });
    }

    // Check for auth token
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
          message: "No authentication token provided",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    // Verify token
    const decoded = await verifyToken(token);
    if (!decoded) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized",
          message: "Invalid authentication token",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    // Check roles for protected paths
    const pathRequiresRole = Object.entries(roleProtectedPaths).find(([path]) =>
      request.nextUrl.pathname.startsWith(path),
    );

    if (pathRequiresRole) {
      const [, requiredRoles] = pathRequiresRole;
      const hasRequiredRole = requiredRoles.some((role) =>
        decoded.roles?.includes(role),
      );

      if (!hasRequiredRole) {
        return new NextResponse(
          JSON.stringify({
            error: "Forbidden",
            message: "Insufficient permissions to access this resource",
          }),
          { status: 403, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    // Add user info to request
    request.headers.set("user", JSON.stringify(decoded));

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Authentication process failed",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export const config = {
  matcher: [
    "/api/user/:path*",
    "/api/admin/:path*",
    "/((?!api/auth/|_next/|login|register|auth/|favicon.ico).*)",
  ],
};
