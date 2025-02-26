/**
 * Data Transfer Object for chat messages
 */
export interface ChatMessageDto {
  /**
   * The unique identifier of the user sending the message
   */
  userId: string;
  
  /**
   * The content of the message sent by the user
   */
  message: string;
} 