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
    const githubId = githubUser.id.toString();
    const email = githubUser.email;

    console.log("Searching for user by GitHub ID or email:", {
      githubId,
      email,
    });

    // First try GitHub ID
    let user = await User.findOne({
      "oauthProfiles.provider": "github",
      "oauthProfiles.providerId": githubId,
    });

    // If not found, try email
    if (!user && email) {
      user = await User.findOne({ email });
      if (user) {
        // Initialize oauthProfiles if undefined
        if (!user.oauthProfiles) user.oauthProfiles = [];
        // Link GitHub profile to existing account
        user.oauthProfiles.push({
          provider: "github",
          providerId: githubId,
          email: email,
          displayName: githubUser.login,
          photoURL: githubUser.avatar_url,
        });
        await user.save();
        console.log("Linked GitHub profile to existing account");
      }
    }

    // If still not found, create new user
    if (!user) {
      user = await User.create({
        email: email,
        oauthProfiles: [
          {
            provider: "github",
            providerId: githubId,
            email: email,
            displayName: githubUser.login,
            photoURL: githubUser.avatar_url,
          },
        ],
      });
      console.log("Created new user with GitHub profile");
    }

    return await handleSuccessfulLogin(user);
  } catch (error) {
    console.error("Database operation error:", error);
    return new Response(null, { status: 500 });
  }
}

// Helper functions
async function handleSuccessfulLogin(user: IUser): Promise<Response> {
  console.log("Handling successful login for user:", user);
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(sessionToken, session.expiresAt);

  return new Response(null, {
    status: 302,
    headers: { Location: "/dashboard" },
  });
}
