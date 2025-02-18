import {
  generateSessionToken,
  createSession,
  setSessionTokenCookie,
} from "@/lib/session";
import { generateLinkingToken, github } from "@/lib/oauth";
import { cookies } from "next/headers";
import type { OAuth2Tokens } from "arctic";
import { User } from "@/app/models";
import { IUser } from "@/app/models/User";
import connectDB from "@/lib/mongodb";
import { redirect } from "next/navigation";
import mongoose from "mongoose";
import { LinkingToken } from "@/app/models/LinkingToken";

// Custom error for account linking scenarios
class AccountLinkingError extends Error {
  constructor(
    message: string,
    public readonly existingProvider: string,
    public readonly email: string,
  ) {
    super(message);
    this.name = "AccountLinkingError";
  }
}

export async function GET(request: Request): Promise<Response> {
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
  } catch (e) {
    // Invalid code or client credentials
    return new Response(null, {
      status: 400,
    });
  }
  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  const githubUser = await githubUserResponse.json();
  const githubUserId = githubUser.id;
  

  const existingUser = await User.findOne({
    oauthprofiles: {
      $elemMatch: {
        provider: "github",
        providerId: githubUserId.toString(),
      },
    },
  });

    if (existingUser) {
        // User already has GitHub connected, just log them in
        return await handleSuccessfulLogin(existingUser);
    }

    const existingEmailUser = await User.findOne({
      email: githubUser.email,
      "oauthProfiles.provider": { $ne: "github" },
    });

    if (existingEmailUser) {
      // Store linking data in session and redirect to confirmation page
      const linkingToken = generateLinkingToken();
      await storeLinkingData(linkingToken, {
        providerId: githubUser.id.toString(),
        email: githubUser.email,
        displayName: githubUser.login,
        photoURL: githubUser.avatar_url,
        accessToken: tokens.accessToken(),
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: `/account/link?token=${linkingToken}&provider=github&existing=${existingEmailUser.oauthProfiles[0].provider}`,
        },
      });
    }

    // 3. Create new user if no existing accounts
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
    return await handleSuccessfulLogin(newUser);
  } catch (error) {
    console.error("Error during GitHub OAuth:", error);

    if (error instanceof AccountLinkingError) {
      // Redirect to account linking page
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/account/link-error?provider=github&existing=${error.existingProvider}&email=${error.email}`,
        },
      });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return new Response(null, {
        status: 400,
        statusText: "Invalid user data",
      });
    }

    return new Response(null, {
      status: 500,
      statusText: "Internal server error during authentication",
    });
  }
}

// Helper functions
async function handleSuccessfulLogin(user: IUser): Promise<Response> {
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSessionTokenCookie(sessionToken, session.expiresAt);

  return new Response(null, {
    status: 302,
    headers: { Location: "/" },
  });
}

async function storeLinkingData(token: string, data: OAuthLinkingData) {
  await LinkingToken.create({
    token,
    data
  });
}

interface OAuthLinkingData {
  providerId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  accessToken: string;
}


