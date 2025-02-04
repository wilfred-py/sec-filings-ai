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
  private connectionAttempts = 0;
  private readonly maxRetries = 3;

  private constructor() {
    this.client = createClient(redisConfig);
    this.setupErrorHandling();
  }

  private setupErrorHandling() {
    this.client.on("error", async (err) => {
      console.error("Redis error:", err);
      if (this.connectionAttempts < this.maxRetries) {
        this.connectionAttempts++;
        await this.reconnect();
      }
    });
  }

  private async reconnect() {
    try {
      await this.client.connect();
      this.connectionAttempts = 0;
    } catch (error) {
      console.error("Reconnection failed:", error);
    }
  }

  public static getInstance() {
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
