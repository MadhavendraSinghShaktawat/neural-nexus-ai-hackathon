import { ChatMessage } from './interfaces/chat-message.interface';
import { GeminiService } from '../../services/gemini.service';
import { Chat } from './chat.model';
import { createChatPrompt } from '../../services/prompt-template';
import { ChatRepository, ChatMessageRecord } from './chat.repository';
import { logger } from '../../config/logger';
import { InMemoryStore } from '../../config/database';
import mongoose from 'mongoose';

interface UserSession {
  messages: ChatMessage[];
}

const userSessions: Record<string, UserSession> = {};

export interface ChatMessageRequest {
  userId: string;
  message: string;
}

export interface ChatMessageResponse {
  userId: string;
  message: string;
  response: string;
  timestamp: string;
}

export class ChatService {
  private readonly geminiService: GeminiService;
  private chatRepository: ChatRepository;
  private isMongoDBAvailable: boolean;

  constructor() {
    this.geminiService = new GeminiService();
    this.chatRepository = new ChatRepository();
    // Check if MongoDB is available by checking the connection state
    this.isMongoDBAvailable = mongoose.connection.readyState === 1;
    
    // Log the MongoDB connection state
    logger.info(`ChatService initialized with MongoDB ${this.isMongoDBAvailable ? 'available' : 'unavailable'}`);
  }

  public async processMessage(params: { userId: string; message: string }): Promise<ChatMessage> {
    const { userId, message } = params;

    // Initialize user session if it doesn't exist
    if (!userSessions[userId]) {
      userSessions[userId] = { messages: [] };
    }

    // Add the new message to the session
    const userMessage: ChatMessage = { userId, message, response: '', timestamp: new Date() };
    userSessions[userId].messages.push(userMessage);

    // Keep only the last 5 messages
    if (userSessions[userId].messages.length > 5) {
      userSessions[userId].messages.shift(); // Remove the oldest message
    }

    // Prepare context for the AI
    const context = userSessions[userId].messages.map(msg => `User: ${msg.message}`).join('\n');
    const prompt = createChatPrompt(message, context);

    logger.info('Prompt sent to Gemini API:', { prompt: prompt.substring(0, 100) + '...' });

    try {
      // Get AI response
      const geminiResponse = await this.geminiService.generateResponse({
        message: prompt
      });
      const response = geminiResponse.response;

      // Save to database or in-memory store
      if (this.isMongoDBAvailable) {
        try {
          const chat = new Chat({
            userId,
            message,
            response,
            timestamp: new Date()
          });
          await chat.save();
        } catch (dbError) {
          logger.error('Failed to save chat to MongoDB, using in-memory store', { error: dbError });
          InMemoryStore.addDocument('chats', {
            userId,
            message,
            response,
            timestamp: new Date()
          });
        }
      } else {
        // Use in-memory store if MongoDB is unavailable
        InMemoryStore.addDocument('chats', {
          userId,
          message,
          response,
          timestamp: new Date()
        });
      }

      // Update the last message with the AI response
      userMessage.response = response;

      return {
        userId,
        message,
        response,
        timestamp: userMessage.timestamp
      };
    } catch (error) {
      logger.error('Error in processMessage', { error });
      
      // Provide a fallback response
      const fallbackResponse = 'I apologize for the technical difficulty. Here are some general well-being strategies: 1) Take deep breaths, 2) Step away for a short break, 3) Stretch your body, 4) Stay hydrated. How are you feeling right now?';
      
      // Update the message with the fallback response
      userMessage.response = fallbackResponse;
      
      return {
        userId,
        message,
        response: fallbackResponse,
        timestamp: userMessage.timestamp
      };
    }
  }

  public async getChatHistory(userId: string): Promise<ChatMessage[]> {
    try {
      if (this.isMongoDBAvailable) {
        const chats = await Chat.find({ userId })
          .sort({ timestamp: -1 })
          .limit(50)
          .exec();
        
        return chats.map(chat => ({
          userId: chat.userId,
          message: chat.message,
          response: chat.response,
          timestamp: chat.timestamp
        }));
      } else {
        // Use in-memory store if MongoDB is unavailable
        const chats = InMemoryStore.findDocuments('chats', { userId });
        return chats.map(chat => ({
          userId: chat.userId,
          message: chat.message,
          response: chat.response,
          timestamp: chat.timestamp
        }));
      }
    } catch (error) {
      logger.error('Error getting chat history', { error });
      return [];
    }
  }

  public async clearChatHistory(userId: string): Promise<void> {
    try {
      await Chat.deleteMany({ userId });
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw new Error('Failed to clear chat history');
    }
  }

  /**
   * Processes a chat message, gets AI response, and stores the conversation
   * @param request - The chat message request containing userId and message
   * @returns The chat message response including the AI response
   */
  public async processChatMessage(request: ChatMessageRequest): Promise<ChatMessageResponse> {
    const { userId, message } = request;
    
    try {
      // Get conversation history for context
      const history = await this.chatRepository.getRecentMessages(userId, 10);
      
      // Format history for Gemini API
      const formattedHistory = history.map((msg: ChatMessageRecord) => ({
        role: (msg.isUser ? 'user' : 'model') as 'user' | 'model',
        content: msg.isUser ? msg.message : msg.response
      }));
      
      // Get response from Gemini API
      const geminiResponse = await this.geminiService.generateResponse({
        message,
        history: formattedHistory
      });
      
      // Create response object
      const response: ChatMessageResponse = {
        userId,
        message,
        response: geminiResponse.response,
        timestamp: new Date().toISOString()
      };
      
      // Store the conversation
      await this.chatRepository.saveMessage({
        userId,
        message,
        response: geminiResponse.response,
        isUser: true,
        timestamp: new Date()
      });
      
      return response;
    } catch (error) {
      logger.error('Error in processChatMessage', { error, userId });
      
      // Return fallback response
      return {
        userId,
        message,
        response: 'I apologize for the technical difficulty. Here are some general well-being strategies: 1) Take deep breaths, 2) Step away for a short break, 3) Stretch your body, 4) Stay hydrated. How are you feeling right now?',
        timestamp: new Date().toISOString()
      };
    }
  }
} 