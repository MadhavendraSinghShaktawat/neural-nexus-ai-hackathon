import mongoose from 'mongoose';
import { config } from './env.config';

export const connectDatabase = async (): Promise<void> => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
    };

    await mongoose.connect(config.mongoUri, options);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}; 