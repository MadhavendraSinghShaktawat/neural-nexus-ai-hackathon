import { Router } from 'express';
import { ChatController } from './chat.controller';
import { chatLimiter } from '../../middleware/rate-limiter';

const router = Router();
const chatController = new ChatController();

// Apply rate limiting to chat endpoints
router.use(chatLimiter);

// [POST] /api/chat - Send message and get AI response
router.post('/', (req, res, next) => chatController.sendMessage(req, res, next));

// [GET] /api/chat/history/:userId - Get chat history for a user
router.get('/history/:userId', (req, res, next) => chatController.getChatHistory(req, res, next));

// [DELETE] /api/chat/history - Clear chat history
router.delete('/history', (req, res, next) => chatController.clearHistory(req, res, next));

export const chatRoutes = router; 