import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { VoiceSession } from './interfaces/voice-session.interface';

// Define the interface locally to avoid dependency issues
interface ChatHistory {
  role: 'user' | 'assistant';
  content: string;
}

export class VoiceService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private sessions: Map<string, VoiceSession>;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.sessions = new Map();
  }

  /**
   * Start a new voice chat session
   * @returns New session ID
   */
  public startSession(): VoiceSession {
    const sessionId = uuidv4();
    const session: VoiceSession = {
      sessionId,
      history: [],
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Process voice input and get AI response
   * @param text - The transcribed text from voice input
   * @param context - Previous chat history for context
   * @param sessionId - Optional session ID
   * @returns AI response and updated chat history
   */
  public async processVoiceInput(
    text: string,
    context?: ChatHistory[],
    sessionId?: string
  ): Promise<{
    response: string;
    history: ChatHistory[];
    sessionId: string;
  }> {
    try {
      let session: VoiceSession;
      
      if (sessionId && this.sessions.has(sessionId)) {
        session = this.sessions.get(sessionId)!;
      } else {
        session = this.startSession();
      }

      const formattedHistory = session.history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      }));

      const chat = this.model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 100,
          temperature: 0.7, // Add some variability to responses
        }
      });

      // Create a more empathetic prompt
      const therapistPrompt = `
        Act as a warm, empathetic therapist having a natural conversation. 
        Keep responses brief (1-2 sentences) and:
        - Use a gentle, conversational tone
        - Show understanding of emotions
        - Use phrases like "I hear you" or "I understand"
        - Avoid clinical or formal language
        - Respond naturally to: ${text}
      `;

      const result = await chat.sendMessage([{ text: therapistPrompt }]);
      const response = await result.response.text();

      session.history.push(
        { role: 'user', content: text },
        { role: 'assistant', content: response }
      );
      session.lastUpdated = new Date();
      
      if (session.history.length > 10) {
        session.history = session.history.slice(-10);
      }

      this.sessions.set(session.sessionId, session);

      return {
        response,
        history: session.history,
        sessionId: session.sessionId
      };
    } catch (error) {
      console.error('Error processing voice input:', error);
      throw new Error('Failed to process voice input');
    }
  }

  /**
   * End a voice chat session and clean up resources
   * @param sessionId - The ID of the session to end
   * @returns true if session was found and ended, false otherwise
   */
  public endSession(sessionId: string): boolean {
    if (!this.sessions.has(sessionId)) {
      return false;
    }
    
    this.sessions.delete(sessionId);
    return true;
  }
} 