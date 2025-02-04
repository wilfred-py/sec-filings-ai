import { getRedisClient } from "./redis";
import { NextRequest } from "next/server";

export async function rateLimit(request: NextRequest) {
  const client = await getRedisClient();
  const ip = request.headers.get("x-forwarded-for") || "anonymous";
  const key = `ratelimit:${ip}`;

  const now = Date.now();
  const windowSize = 60 * 1000; // 1 minute
  const limit = 100; // requests per window

  try {
    // Using Redis Multi for atomic operations
    const multi = client.multi();

    multi
      .zRemRangeByScore(key, 0, now - windowSize)
      .zAdd(key, { score: now, value: now.toString() })
      .zCard(key)
      .expire(key, 60);

    const results = await multi.exec();
    const count = results?.[2] as number;

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
