import mongoose from 'mongoose';
import { config } from './config';
import { logger } from './logger';

export async function connectToDatabase(): Promise<boolean> {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
      ssl: true,
      tls: true
    });
    
    logger.info('Connected to MongoDB');
    return true;
  } catch (error) {
    logger.error('MongoDB connection error:', { 
      error: error instanceof Error ? error.message : String(error)
    });
    return false;
  }
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

// Create a memory store for when MongoDB is unavailable
export class InMemoryStore {
  private static store: Record<string, any[]> = {};
  
  public static getCollection(name: string): any[] {
    if (!this.store[name]) {
      this.store[name] = [];
    }
    return this.store[name];
  }
  
  public static addDocument(collection: string, document: any): any {
    const doc = { ...document, _id: Date.now().toString(), createdAt: new Date() };
    this.getCollection(collection).push(doc);
    return doc;
  }
  
  public static findDocuments(collection: string, filter: Record<string, any> = {}): any[] {
    const docs = this.getCollection(collection);
    
    if (Object.keys(filter).length === 0) {
      return [...docs];
    }
    
    return docs.filter(doc => {
      return Object.entries(filter).every(([key, value]) => doc[key] === value);
    });
  }
} 