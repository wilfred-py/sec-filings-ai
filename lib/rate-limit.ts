import { redis } from "./redis";
import { NextRequest } from "next/server";

export async function rateLimit(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const key = `ratelimit:${ip}`;

  const now = Date.now();
  const windowSize = 60 * 1000; // 1 minute
  const limit = 100; // requests per window

  try {
    const result = await redis
      .pipeline()
      .zremrangebyscore(key, 0, now - windowSize) // Remove old entries
      .zadd(key, { score: now, member: now.toString() }) // Fixed type here
      .zcard(key) // Get number of requests in window
      .expire(key, 60) // Set expiry
      .exec();

    const count = result?.[2] as number;

    return {
      success: count <= limit,
      retryAfter:
        count > limit ? Math.ceil((windowSize - (now % windowSize)) / 1000) : 0,
    };
  } catch (error) {
    console.error("Rate limiting error:", error);
    // Fail open - allow request if Redis is down
    return { success: true };
  }
}
