import mongoose from 'mongoose';

import { env } from './env';

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB error:', error.message);
  });

  await mongoose.connect(env.MONGODB_URI, {
    dbName: env.MONGODB_DB_NAME,
    serverSelectionTimeoutMS: 10_000,
  });

  console.log(`✅ MongoDB connected (db: ${env.MONGODB_DB_NAME})`);
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.connection.close();
}
