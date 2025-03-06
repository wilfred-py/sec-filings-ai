import { globalGETRateLimit } from "@/lib/request";
import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/session";
import { google } from "@/lib/oauth";
import { cookies } from "next/headers";
import type { OAuth2Tokens } from "arctic";
import connectDB from "@/lib/mongodb";
import { decodeIdToken } from "arctic";
import User from "@/app/models/User";

interface GoogleClaims {
  sub: string;
  name: string;
  email: string;
}

export async function GET(request: Request): Promise<Response> {
  if (!globalGETRateLimit()) {
    return new Response("Too many requests", {
      status: 429,
    });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState =
    (await cookieStore.get("google_oauth_state")?.value) ?? null;
  const codeVerifier =
    (await cookieStore.get("google_code_verifier")?.value) ?? null;

  // Validate OAuth parameters
  if (
    !code ||
    !state ||
    !storedState ||
    !codeVerifier ||
    state !== storedState
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  //   Connect to DB
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection error:", error);
    return new Response(null, { status: 500 });
  }

  //   Get Google user details
  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code!, codeVerifier!);
  } catch (error) {
    console.error("Google token validation error:", error);
    return new Response(null, {
      status: 400,
    });
  }
  const claims = decodeIdToken(tokens.idToken()) as GoogleClaims;
  const googleUserId = claims.sub;
  const username = claims.name;

  // First check for existing OAuth user
  const existingUser = await User.findOne({
    "oauthProfiles.provider": "google",
    "oauthProfiles.providerId": googleUserId,
  });

  if (existingUser) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: { Location: "/dashboard" },
    });
  }

  // If no OAuth user found, check for existing email user
  const existingEmailUser = await User.findOne({ email: claims.email });

  if (existingEmailUser) {
    // Add Google profile to existing user
    existingEmailUser.oauthProfiles.push({
      provider: "google",
      providerId: googleUserId,
      email: claims.email,
      displayName: username,
    });
    await existingEmailUser.save();

    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingEmailUser.id);
    setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: { Location: "/dashboard" },
    });
  }

  // If no existing user at all, create new one
  const user = await User.create({
    email: claims.email,
    oauthProfiles: [
      {
        provider: "google",
        providerId: googleUserId,
        email: claims.email,
        displayName: username,
      },
    ],
  });

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/dashboard",
    },
  });
}
