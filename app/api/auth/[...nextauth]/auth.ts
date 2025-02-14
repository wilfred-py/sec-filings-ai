import { AuthOptions, DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import credentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import connectDB from "@/lib/mongodb";
import { User } from "@/app/models";
import bcrypt from "bcryptjs";

// Your type definitions
interface ExtendedSession extends DefaultSession {
  user: {
    id: string;
    roles: string[];
    emailVerified: boolean;
  } & DefaultSession["user"];
}

interface ExtendedUser extends DefaultUser {
  _id: string;
  roles: string[];
  emailVerified: boolean;
}

interface ExtendedJWT extends JWT {
  id: string;
  roles: string[];
  emailVerified: boolean;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function connectWithRetry() {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await connectDB();
      return true;
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error);
      if (i < MAX_RETRIES - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * (i + 1)),
        );
      }
    }
  }
  return false;
}

export const authOptions: AuthOptions = {
  providers: [
    credentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize function called"); // Debug log
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        try {
          console.log("Attempting DB connection in authorize"); // Debug log
          const connected = await connectWithRetry();
          if (!connected) {
            console.error(
              "Failed to connect to database after multiple retries",
            );
            throw new Error("Database connection failed");
          }

          const user = await User.findOne({ email: credentials.email })
            .select("+password")
            .maxTimeMS(5000);

          if (!user) {
            throw new Error("No user found with this email");
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!passwordMatch) {
            throw new Error("Invalid password");
          }

          // Return user without password
          const { ...userWithoutPassword } = user.toObject();
          return userWithoutPassword;
        } catch (error) {
          console.error("Authorization error:", error);
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("An unexpected error occurred");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          const extendedUser = user as ExtendedUser;
          token.id = extendedUser._id;
          token.roles = extendedUser.roles;
          token.emailVerified = extendedUser.emailVerified;
        }
        return token as ExtendedJWT;
      } catch (error) {
        console.error("JWT Callback Error:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        const extendedToken = token as ExtendedJWT;
        const extendedSession = session as ExtendedSession;
        console.log("extendedSession", extendedSession);

        if (token) {
          extendedSession.user.id = extendedToken.id;
          extendedSession.user.roles = extendedToken.roles;
          extendedSession.user.emailVerified = extendedToken.emailVerified;
        }
        return extendedSession;
      } catch (error) {
        console.error("Session Callback Error:", error);
        return session;
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error: (code, metadata) => {
      console.error("Auth Error:", { code, metadata });
    },
    warn: (code) => {
      console.warn("Auth Warning:", code);
    },
    debug: (code, metadata) => {
      console.debug("Auth Debug:", { code, metadata });
    },
  },
};
