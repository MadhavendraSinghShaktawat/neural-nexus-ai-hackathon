import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { moodRouter } from './modules/mood/mood.controller';
import { voiceRouter } from './modules/voice/voice.controller';
import expressionRoutes from './modules/expression/expression.routes';
import { logger } from './config/logger';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`, {
    body: req.body,
    query: req.query,
    params: req.params
  });
  next();
});

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
app.use('/moods', moodRouter);
app.use('/api/voice', voiceRouter);
app.use('/api/expression', expressionRoutes);

// Test route for expression API
app.get('/api/expression-test', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Expression API test route is working' });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Resource not found'
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error', { error: err });
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

export { app }; 