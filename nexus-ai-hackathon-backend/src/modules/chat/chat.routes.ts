/**
 * Routes for chat functionality
 */
import { Router } from 'express';
import { ChatController } from './chat.controller';
import { chatLimiter } from '../../middleware/rate-limiter';

const router = Router();
const chatController = new ChatController();

// Apply rate limiting to chat endpoints
router.use(chatLimiter);

// POST /api/chat - Send a message and get AI response
router.post('/', chatController.sendMessage.bind(chatController));

// GET /api/chat/history/:userId - Get chat history for a user
router.get('/history/:userId', chatController.getChatHistory.bind(chatController));

// POST /api/chat/clear - Clear chat history for a user
router.post('/clear', chatController.clearHistory.bind(chatController));

export const chatRoutes = router; 