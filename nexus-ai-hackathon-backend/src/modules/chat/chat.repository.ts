/**
 * Repository for chat-related database operations
 */
import { Chat } from './chat.model';
import { ChatMessage } from './interfaces/chat-message.interface';

export interface ChatMessageRecord extends ChatMessage {
  isUser: boolean;
}

export class ChatRepository {
  /**
   * Retrieves recent messages for a user
   * @param userId - The ID of the user
   * @param limit - Maximum number of messages to retrieve
   * @returns Array of recent chat messages
   */
  public async getRecentMessages(userId: string, limit: number): Promise<ChatMessageRecord[]> {
    const messages = await Chat.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .exec();
    
    return messages.map(msg => ({
      userId: msg.userId,
      message: msg.message,
      response: msg.response,
      timestamp: msg.timestamp,
      isUser: true // Assuming all stored messages are from the user
    }));
  }

  /**
   * Saves a chat message to the database
   * @param message - The chat message to save
   * @returns The saved chat message
   */
  public async saveMessage(message: ChatMessageRecord): Promise<ChatMessageRecord> {
    const chat = new Chat({
      userId: message.userId,
      message: message.message,
      response: message.response,
      timestamp: message.timestamp
    });
    
    await chat.save();
    return message;
  }

  /**
   * Deletes all chat messages for a user
   * @param userId - The ID of the user
   */
  public async deleteAllMessages(userId: string): Promise<void> {
    await Chat.deleteMany({ userId }).exec();
  }
} 