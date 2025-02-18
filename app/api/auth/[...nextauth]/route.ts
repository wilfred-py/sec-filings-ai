import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import clientPromise from "@/lib/mongodb-client";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
// Add timeout handling
const TIMEOUT_MS = 10000;

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      httpOptions: {
        timeout: TIMEOUT_MS,
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {},
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error("NextAuth Error:", { code, metadata });
    },
    warn(code) {
      console.warn("NextAuth Warning:", code);
    },
    debug(code, metadata) {
      console.log("NextAuth Debug:", { code, metadata });
    },
  },
};

// Wrap handler with error boundary
const handler = async (req: NextRequest, res: NextResponse) => {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(req);

    if (!rateLimitResult.success) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": (rateLimitResult.retryAfter ?? 60).toString(),
        },
      });
    }

    return await NextAuth(authOptions)(req, res);
  } catch (error) {
    console.error("NextAuth Handler Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export { handler as GET, handler as POST };
