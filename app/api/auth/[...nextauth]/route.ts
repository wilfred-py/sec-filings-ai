import NextAuth from "next-auth";
import { authOptions } from "./auth";
import connectDB from "@/lib/mongodb";

// Ensure DB connection before handling auth
const handler = async (req: Request, ...args: any[]) => {
  try {
    await connectDB();
    const authHandler = NextAuth(authOptions);
    return authHandler(req, ...args);
  } catch (error) {
    console.error("Auth handler error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

export { handler as GET, handler as POST };
