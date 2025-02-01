import NextAuth, { AuthOptions } from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import { User } from "@/app/models";

export const authOptions = {
  providers: [
    credentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        emailVerified: { label: "Email Verified", type: "boolean" },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          // Find user in database
          const user = await User.findOne({ email: credentials?.email });

          if (!user) {
            return null;
          }

          // Compare passwords
          const passwordMatch = await bcrypt.compare(
            credentials?.password || "",
            user.password,
          );

          if (!passwordMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.log("Error: ", error);
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
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user._id;
        token.roles = user.roles;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.roles = token.roles;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions as AuthOptions);

export { handler as GET, handler as POST };
