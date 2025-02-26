export interface VoiceSession {
  sessionId: string;
  history: {
    role: 'user' | 'assistant';
    content: string;
  }[];
  createdAt: Date;
  lastUpdated: Date;
} 