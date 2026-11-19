import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ameenofficial33_db_user:Dl6TIIhJZytix4rn@cluster0.h82jpc3.mongodb.net/parvaii?retryWrites=true&w=majority';

// Global cache for serverless environments (Vercel) to reuse connection across invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export let lastDbError = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cached.conn && mongoose.connection.readyState >= 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      lastDbError = null;
      console.log(`[MongoDB Atlas] Connected successfully to host: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    }).catch((err) => {
      cached.promise = null;
      lastDbError = err.message;
      console.error(`[MongoDB Atlas Error]`, err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    lastDbError = null;
  } catch (e) {
    cached.promise = null;
    lastDbError = e.message;
    throw e;
  }

  return cached.conn;
};
