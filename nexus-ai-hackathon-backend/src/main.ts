import { config } from './config/config';
import { app } from './app';
import mongoose from 'mongoose';
import { logger } from './config/logger';

const PORT = config.PORT || 3000;

// Connect to MongoDB with updated connection string and options
mongoose.connect(config.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority',
  authSource: 'admin',
  ssl: true,
  tls: true
})
  .then(() => {
    logger.info('Connected to MongoDB');
    
    // Start the server using the imported app
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB', { 
      error: error instanceof Error ? error.message : String(error)
    });
    
    // Start the server even if MongoDB connection fails
    // This allows the API to function with fallback responses
    app.listen(PORT, () => {
      logger.warn(`Server is running without MongoDB connection on http://localhost:${PORT}`);
    });
  }); 