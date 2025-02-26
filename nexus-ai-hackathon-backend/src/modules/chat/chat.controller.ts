import { Request, Response, NextFunction } from 'express';
import { ChatService } from './chat.service';
import { ChatRequestDto, ChatResponseDto } from './dto/chat-request.dto';
import { logger } from '../../config/logger';
import { ChatMessageDto } from './dto/chat-message.dto';

export class ChatController {
  private readonly chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  public async sendMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, userId } = req.body as ChatRequestDto;
      
      if (!message || !userId) {
        res.status(400).json({ 
          status: 'error',
          message: 'Message and userId are required' 
        });
        return;
      }

      const response = await this.chatService.processMessage({ userId, message });
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  public async getChatHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        res.status(400).json({ 
          status: 'error',
          message: 'UserId is required' 
        });
        return;
      }

      const history = await this.chatService.getChatHistory(userId);
      res.status(200).json(history);
    } catch (err) {
      next(err);
    }
  }

  public async clearHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        res.status(400).json({ 
          status: 'error',
          message: 'UserId is required' 
        });
        return;
      }

      await this.chatService.clearChatHistory(userId);
      res.status(200).json({ 
        status: 'success',
        message: 'Chat history cleared successfully' 
      });
    } catch (err) {
      next(err);
    }
  }

  public async handleChatMessage(req: Request, res: Response): Promise<void> {
    try {
      const chatMessageDto: ChatMessageDto = req.body;
      
      // Validate request body
      if (!chatMessageDto.userId || !chatMessageDto.message) {
        res.status(400).json({ error: 'userId and message are required fields' });
        return;
      }
      
      // Process the chat message
      const result = await this.chatService.processChatMessage({
        userId: chatMessageDto.userId,
        message: chatMessageDto.message
      });
      
      res.status(200).json(result);
    } catch (error) {
      logger.error('Error processing chat message', { error });
      res.status(500).json({ 
        error: 'An error occurred while processing your message',
        message: 'Please try again later'
      });
    }
  }
} 