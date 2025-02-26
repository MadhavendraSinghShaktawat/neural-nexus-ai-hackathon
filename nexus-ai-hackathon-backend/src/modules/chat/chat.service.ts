import { ChatMessage } from './interfaces/chat-message.interface';
import { GeminiService } from '../../services/gemini.service';
import { Chat } from './chat.model';
import { createChatPrompt } from '../../services/prompt-template';

interface UserSession {
  messages: ChatMessage[];
}

const userSessions: Record<string, UserSession> = {};

export class ChatService {
  private readonly geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
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
    const response = await this.geminiService.generateResponse(prompt);

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
} 