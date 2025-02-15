import NextAuth from "next-auth";
import { authOptions } from "./auth";

console.log("Setting up NextAuth handler"); // Debug log

const handler = NextAuth({
  ...authOptions,
  debug: true, // Enable debug logs
  logger: {
    error: (code, metadata) => {
      console.error("NextAuth Error:", { code, metadata });
    },
    warn: (code) => console.warn("NextAuth Warning:", code),
    debug: (code, metadata) => {
      console.log("NextAuth Debug:", { code, metadata });
    },
  },
});

export { handler as GET, handler as POST };
