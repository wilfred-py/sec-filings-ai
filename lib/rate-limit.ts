import { Redis } from '@upstash/redis';
import { NextRequest } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!
});

const WINDOW_SIZE = 60; // 1 minute
const MAX_REQUESTS = 100;

export async function rateLimit(request: NextRequest) {
  const ip = request.ip || 'anonymous';
  const key = `rate-limit:${ip}`;

  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, WINDOW_SIZE);
  }

  if (current > MAX_REQUESTS) {
    return {
      success: false,
      retryAfter: WINDOW_SIZE
    };
  }

  return { success: true };
} 