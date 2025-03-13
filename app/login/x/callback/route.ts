import { globalGETRateLimit } from "@/lib/request";
import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/session";
import { x } from "@/lib/oauth";
import { cookies } from "next/headers";
import type { OAuth2Tokens } from "arctic";
import User from "@/app/models/User";
import { IUser } from "@/app/models/User";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET(request: Request): Promise<Response> {
  if (!(await globalGETRateLimit())) {
    return new Response("Too many requests", {
      status: 429,
    });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("x_oauth_state")?.value ?? null;
  const codeVerifier = cookieStore.get("x_code_verifier")?.value ?? null;

  // Validate OAuth parameters
  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return new Response(null, {
      status: 400,
      statusText: "Invalid OAuth parameters",
    });
  }

  //   Connect to DB
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
    return new Response(null, { status: 500 });
  }

  //   Get access token
  let tokens: OAuth2Tokens;
  try {
    tokens = await x.validateAuthorizationCode(code, codeVerifier);
  } catch (error) {
    console.error("X token validation error:", error);
    return new Response(null, { status: 400 });
  }

  // Clear the OAuth cookies
  cookieStore.delete("x_oauth_state");
  cookieStore.delete("x_code_verifier");

  //   Get X user details from v2 API
  let xUserResponse: Response;
  try {
    xUserResponse = await fetch("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${(tokens.data as { access_token?: string })?.access_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!xUserResponse.ok) {
      const errorText = await xUserResponse.text();
      console.error("X API error response:", errorText);
      return new Response("Failed to fetch user info", { status: 500 });
    }

    const xUser = await xUserResponse.json();

    const xUserId = xUser.data.id;

    // Database operations
    try {
      const existingUser = await User.findOne({
        "oauthProfiles.provider": "x",
        "oauthProfiles.providerId": xUserId.toString(),
      });

      if (existingUser) {
        return await handleSuccessfulLogin(existingUser);
      }

      const newUser = await User.create({
        oauthProfiles: [
          {
            provider: "x",
            providerId: xUser.data.id.toString(),
            email: xUser.data.email,
            displayName: xUser.data.username,
            photoURL: xUser.data.profile_image_url,
          },
        ],
      });

      return await handleSuccessfulLogin(newUser);
    } catch (error) {
      console.error("Database operation error:", error);
      if (error instanceof mongoose.Error.ValidationError) {
        return new Response(null, {
          status: 400,
          statusText: "Invalid user data",
        });
      }
      return new Response(null, { status: 500 });
    }
  } catch (error) {
    console.error("Token debug info:", {
      tokens,
      error: error instanceof Error ? error.message : String(error),
    });
    return new Response("Failed to fetch user info", { status: 500 });
  }
}

// Helper functions
async function handleSuccessfulLogin(user: IUser): Promise<Response> {
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(sessionToken, session.expiresAt);

  return new Response(null, {
    status: 302,
    headers: { Location: "/dashboard" },
  });
}
