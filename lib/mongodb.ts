import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

const MONGODB_URI: string = process.env.MONGODB_URI;

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// In global namespace
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: null | typeof mongoose;
    promise: null | Promise<typeof mongoose>;
  };
}

let cached: Cached = (global.mongoose as Cached) || {
  conn: null,
  promise: null,
};

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
  cached = global.mongoose as Cached;
}

async function connectDB() {
  if (cached.conn) {
    console.log("Using cached connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // CHANGED: Enable buffering
      maxPoolSize: 10, // CHANGED: Increased pool size
      serverSelectionTimeoutMS: 30000, // CHANGED: Increased timeout
      socketTimeoutMS: 45000, // CHANGED: Increased timeout
      family: 4,
      ssl: true,
      tls: true,
      tlsInsecure: false,
      retryWrites: true,
      w: "majority",
      maxIdleTimeMS: 60000,
      compressors: "zlib",
    } as const;

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Register event handlers only once
if (mongoose.connection.listenerCount("error") === 0) {
  // Connection error handlers
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
    if (err.name === "MongoNetworkError") {
      console.log("Network error detected, attempting to reconnect...");
      cached.conn = null;
      cached.promise = null;
    }
  });

  mongoose.connection.on("disconnected", async () => {
    console.log("MongoDB disconnected, attempting to reconnect...");
    cached.conn = null;
    cached.promise = null;
  });

  mongoose.connection.on("connecting", () => {
    console.log("Connecting to MongoDB...");
  });

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected successfully");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected successfully");
  });
}

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    process.exit(1);
  }
});

export default connectDB;
