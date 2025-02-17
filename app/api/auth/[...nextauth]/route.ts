import NextAuth from "next-auth";
import { authOptions } from "./auth";

console.log("Setting up NextAuth handler"); // Debug log

const handler = NextAuth({
  ...authOptions,
  debug: true, // Enable debug logs
  logger: {
    error: (code, metadata) => {
      console.error(`[${new Date().toISOString()}] Session Error:`, {
        code,
        metadata,
      });
    },
    warn: (code) => {
      console.warn("NextAuth Warning:", code);
    },
    debug: (code, metadata) => {
      console.log("NextAuth Debug:", { code, metadata });
      // Log session-specific issues
      if (code === "session") {
        console.log("Session details:", metadata);
      }
    },
  },
});

export { handler as GET, handler as POST };
