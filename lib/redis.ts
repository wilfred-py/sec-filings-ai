import { createClient } from "redis";

// Type for Redis client configuration
interface RedisConfig {
  username: string;
  password: string;
  socket: {
    host: string;
    port: number;
  };
}

// Redis client configuration
const redisConfig: RedisConfig = {
  username: "default",
  password: process.env.REDIS_TOKEN!,
  socket: {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!, 10),
  },
};

// Singleton pattern for Redis client
class RedisService {
  private static instance: RedisService;
  private client: ReturnType<typeof createClient>;

  private constructor() {
    this.client = createClient(redisConfig);

    this.client.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    this.client.on("connect", () => {
      console.log("Redis Client Connected");
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async getClient() {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
    return this.client;
  }
}

export const getRedisClient = () => RedisService.getInstance().getClient();
