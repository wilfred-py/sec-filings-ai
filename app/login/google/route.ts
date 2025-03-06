import { globalGETRateLimit } from "@/lib/request";
import { generateState, generateCodeVerifier } from "arctic";
import { google } from "@/lib/oauth";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  if (!globalGETRateLimit()) {
    return new Response("Too many requests", {
      status: 429,
    });
  }

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ]);

  const cookieStore = await cookies();
  await cookieStore.set("google_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });
  await cookieStore.set("google_code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/dashboard",
    },
  });
}
