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

export class TokenBucket<_Key> {
  public max: number;
  public refillIntervalSeconds: number;

  constructor(max: number, refillIntervalSeconds: number) {
    this.max = max;
    this.refillIntervalSeconds = refillIntervalSeconds;
  }

  private storage = new Map<_Key, Bucket>();

  public check(key: _Key, cost: number): boolean {
    const bucket = this.storage.get(key) ?? null;
    if (bucket === null) {
      return true;
    }
    const now = Date.now();
    const refill = Math.floor(
      (now - bucket.refilledAt) / (this.refillIntervalSeconds * 1000),
    );
    if (refill > 0) {
      return Math.min(bucket.count + refill, this.max) >= cost;
    }
    return bucket.count >= cost;
  }

  public consume(key: _Key, cost: number): boolean {
    let bucket = this.storage.get(key) ?? null;
    const now = Date.now();
    if (bucket === null) {
      bucket = {
        count: this.max - cost,
        refilledAt: now,
      };
      this.storage.set(key, bucket);
      return true;
    }
    const refill = Math.floor(
      (now - bucket.refilledAt) / (this.refillIntervalSeconds * 1000),
    );
    if (refill > 0) {
      bucket.count = Math.min(bucket.count + refill, this.max);
      bucket.refilledAt = now;
    }
    if (bucket.count < cost) {
      this.storage.set(key, bucket);
      return false;
    }
    bucket.count -= cost;
    this.storage.set(key, bucket);
    return true;
  }
}
interface Bucket {
  count: number;
  refilledAt: number;
}
