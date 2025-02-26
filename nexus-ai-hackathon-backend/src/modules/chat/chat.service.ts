import { ChatMessage } from './interfaces/chat-message.interface';
import { GeminiService } from '../../services/gemini.service';
import { Chat } from './chat.model';
import { createChatPrompt } from '../../services/prompt-template';
import { ChatRepository, ChatMessageRecord } from './chat.repository';
import { logger } from '../../config/logger';

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

  constructor() {
    this.geminiService = new GeminiService();
    this.chatRepository = new ChatRepository();
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

    console.log('Prompt sent to Gemini API:', prompt);

    // Get AI response
    const geminiResponse = await this.geminiService.generateResponse({
      message: prompt
    });
    const response = geminiResponse.response;

    // Save to database
    const chat = new Chat({
      userId,
      message,
      response,
      timestamp: new Date()
    });
    await chat.save();

    // Update the last message with the AI response
    userMessage.response = response;

    return {
      userId,
      message,
      response,
      timestamp: chat.timestamp
    };
  }

  public async getChatHistory(userId: string): Promise<ChatMessage[]> {
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