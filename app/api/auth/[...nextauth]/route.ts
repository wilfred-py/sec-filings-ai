import NextAuth from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import { User } from "@/app/models";

export const authOptions = {
  providers: [
    credentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "First Name",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectDB();

          // Find user in database
          const user = await User.findOne({ username: credentials?.username });

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
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
