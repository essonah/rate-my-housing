import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

export async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI in environment (.env)');
  }

  await mongoose.connect(uri);
  return mongoose.connection;
}
