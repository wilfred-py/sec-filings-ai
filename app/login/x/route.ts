import { globalGETRateLimit } from "@/lib/request";
import { generateState, generateCodeVerifier } from "arctic";
import { x } from "@/lib/oauth";
import { cookies } from "next/headers";

export async function GET(): Promise<Response> {
  if (!(await globalGETRateLimit())) {
    return new Response("Too many requests", {
      status: 429,
    });
  }

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const scopes = ["tweet.read", "users.read", "offline.access"];

  const url = x.createAuthorizationURL(state, codeVerifier, scopes);

  const cookiesStore = await cookies();

  cookiesStore.set("x_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  cookiesStore.set("x_code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
    },
  });
}
