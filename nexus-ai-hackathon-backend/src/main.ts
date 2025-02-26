import { config } from './config/env.config';
import { app } from './app';
import mongoose from 'mongoose';
import { logger } from './config/logger';

const PORT = config.port || 3000;

// Connect to MongoDB
mongoose.connect(config.mongoUri)
  .then(() => {
    logger.info('Connected to MongoDB');
    
    // Start the server using the imported app
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB', { error });
    process.exit(1);
  }); 