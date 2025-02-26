import { Request, Response, NextFunction } from 'express';
import { ChatService } from './chat.service';
import { ChatRequestDto, ChatResponseDto } from './dto/chat-request.dto';

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
} 