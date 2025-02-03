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
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: true,
      minPoolSize: 10,
      maxPoolSize: 100,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      ssl: true,
      tls: true,
      tlsInsecure: false,
      retryWrites: true,
      w: 1,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
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

// Add connection error handlers
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

export default connectDB;
