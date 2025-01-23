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
  fastConn: typeof mongoose | null;
  slowConn: typeof mongoose | null;
  fastPromise: Promise<typeof mongoose> | null;
  slowPromise: Promise<typeof mongoose> | null;
}

// In global namespace
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    fastConn: null | typeof mongoose;
    slowConn: null | typeof mongoose;
    fastPromise: null | Promise<typeof mongoose>;
    slowPromise: null | Promise<typeof mongoose>;
  };
}

let cached: Cached = global.mongoose || {
  fastConn: null,
  slowConn: null,
  fastPromise: null,
  slowPromise: null
};

if (!global.mongoose) {
  global.mongoose = cached;
}

const fastOptions: mongoose.ConnectOptions = {
  maxPoolSize: 3,
  minPoolSize: 1,
  maxIdleTimeMS: 60000,
  socketTimeoutMS: 2000, // Faster timeout for quick operations
};

const slowOptions: mongoose.ConnectOptions = {
  maxPoolSize: 2,
  minPoolSize: 1,
  maxIdleTimeMS: 120000,
  socketTimeoutMS: 5000, // Longer timeout for create operations
};

async function connectFastDB() {
  if (cached.fastConn) {
    return cached.fastConn;
  }

  if (!cached.fastPromise) {
    cached.fastPromise = mongoose.createConnection(process.env.MONGODB_URI!, fastOptions).asPromise();
  }

  try {
    cached.fastConn = await cached.fastPromise;
  } catch (e) {
    cached.fastPromise = null;
    throw e;
  }

  return cached.fastConn;
}

async function connectSlowDB() {
  if (cached.slowConn) {
    return cached.slowConn;
  }

  if (!cached.slowPromise) {
    cached.slowPromise = mongoose.createConnection(process.env.MONGODB_URI!, slowOptions).asPromise();
  }

  try {
    cached.slowConn = await cached.slowPromise;
  } catch (e) {
    cached.slowPromise = null;
    throw e;
  }

  return cached.slowConn;
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

export { connectFastDB, connectSlowDB }; 