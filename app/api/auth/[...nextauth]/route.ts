import NextAuth, { AuthOptions, DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import credentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import { User } from "@/app/models";

// Extend the built-in session types
interface ExtendedSession extends DefaultSession {
  user: {
    id: string;
    roles: string[];
    emailVerified: boolean;
  } & DefaultSession["user"];
}

// Extend the built-in user types
interface ExtendedUser extends DefaultUser {
  _id: string;
  roles: string[];
  emailVerified: boolean;
}

// Extend the built-in JWT types
interface ExtendedJWT extends JWT {
  id: string;
  roles: string[];
  emailVerified: boolean;
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        try {
          // Establish DB connection with retry logic
          let retries = 3;
          while (retries > 0) {
            try {
              await connectDB();
              break;
            } catch (error) {
              retries--;
              if (retries === 0) throw error;
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
            }
          }

          const user = await User.findOne({ email: credentials.email }).select(
            "+password",
          );

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
          const { password, ...userWithoutPassword } = user.toObject();
          return userWithoutPassword;
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
    // Add these for more stability
    updateAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const extendedUser = user as ExtendedUser;
        token.id = extendedUser._id;
        token.roles = extendedUser.roles;
        token.emailVerified = extendedUser.emailVerified;
      }
      return token as ExtendedJWT;
    },
    async session({ session, token }) {
      const extendedToken = token as ExtendedJWT;
      const extendedSession = session as ExtendedSession;

      if (token) {
        extendedSession.user.id = extendedToken.id;
        extendedSession.user.roles = extendedToken.roles;
        extendedSession.user.emailVerified = extendedToken.emailVerified;
      }
      return extendedSession;
    },
  },

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
