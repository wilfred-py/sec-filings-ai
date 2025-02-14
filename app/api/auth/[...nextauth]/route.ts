import NextAuth from "next-auth";
import { authOptions } from "./auth";
import connectDB from "@/lib/mongodb";

// Ensure DB connection before handling auth
const handler = async (req: Request, ...args: any[]) => {
  console.log("Auth handler started"); // Debug log
  try {
    console.log("Attempting DB connection"); // Debug log
    await connectDB();
    console.log("DB connected, creating auth handler"); // Debug log
    const authHandler = NextAuth(authOptions);
    console.log("Auth handler created, processing request"); // Debug log
    return authHandler(req, ...args);
  } catch (error) {
    console.error("Auth handler error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

export { handler as GET, handler as POST };
