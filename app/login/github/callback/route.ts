import { globalGETRateLimit } from "@/lib/request";
import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/session";
import { github } from "@/lib/oauth";
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
  const storedState = cookieStore.get("github_oauth_state")?.value ?? null;

  // Validate OAuth parameters
  if (!code || !state || !storedState || state !== storedState) {
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

  //   Get GitHub user details
  let tokens: OAuth2Tokens;
  try {
    tokens = await github.validateAuthorizationCode(code);
  } catch (error) {
    console.error("GitHub token validation error:", error);
    return new Response(null, { status: 400 });
  }

  try {
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    });

    if (!githubUserResponse.ok) {
      console.error("GitHub API error:", await githubUserResponse.text());
      return new Response(null, { status: 500 });
    }

    const githubUser = await githubUserResponse.json();
    // console.log("GitHub user data:", githubUser); // Debug user data
    const githubUserId = githubUser.id;

    try {
      console.log("Searching for existing user with GitHub ID:", githubUserId);
      const existingUser = await User.findOne({
        "oauthProfiles.provider": "github",
        "oauthProfiles.providerId": githubUserId.toString(),
      });
      console.log("Existing user found:", existingUser);

      if (existingUser) {
        return await handleSuccessfulLogin(existingUser);
      }

      console.log("Creating new user with email:", githubUser.email);
      const newUser = await User.create({
        email: githubUser.email,
        oauthProfiles: [
          {
            provider: "github",
            providerId: githubUser.id.toString(),
            email: githubUser.email,
            displayName: githubUser.login,
            photoURL: githubUser.avatar_url,
          },
        ],
      });
      console.log("New user created:", newUser);
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
    console.error("GitHub user fetch error:", error);
    return new Response(null, { status: 500 });
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
