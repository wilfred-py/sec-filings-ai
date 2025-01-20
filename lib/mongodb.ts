import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// In global namespace
declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: null | typeof mongoose; promise: null | Promise<typeof mongoose> };
}

let cached: Cached = (global.mongoose as Cached) || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
  cached = global.mongoose as Cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
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

mongoose.connection.on('connected', () => {
  console.log('[MongoDB] Connected successfully', {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

console.log('Current environment:', process.env.NODE_ENV);

export default connectDB; 