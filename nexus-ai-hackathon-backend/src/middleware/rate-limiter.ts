import rateLimit from 'express-rate-limit';
import { logger } from '../config/logger';

// Create a limiter for chat endpoints
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', { 
      ip: req.ip,
      path: req.path
    });
    
    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later.'
    });
  }
});

// Create a more restrictive limiter for AI endpoints
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('AI rate limit exceeded', { 
      ip: req.ip,
      path: req.path
    });
    
    res.status(429).json({
      status: 'error',
      message: 'Too many AI requests, please try again later.'
    });
  }
}); 