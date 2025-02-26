/**
 * Routes for expression/emotion detection
 */
import { Router } from 'express';
import { ExpressionController } from './expression.controller';

const router = Router();
const expressionController = new ExpressionController();

// POST /api/expression/detect - Detect emotion from text
router.post('/detect', expressionController.detectEmotion);

// Add a simple test route
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Expression API is working' });
});

// Export the router correctly
export default router; 