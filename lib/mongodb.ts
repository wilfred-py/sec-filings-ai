import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Ensure uri is defined for TypeScript
const MONGODB_URI: string = uri;

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
    const opts: mongoose.ConnectOptions = {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
      ssl: true,
      tls: true,
      tlsInsecure: false,
      retryWrites: true,
      w: 1
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