export interface ChatRequestDto {
  userId: string;
  message: string;
}

export interface ChatResponseDto {
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
} 