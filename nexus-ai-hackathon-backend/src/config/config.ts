/**
 * Configuration module for the application
 */
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/therapist',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  // Add other configuration variables as needed
}; 