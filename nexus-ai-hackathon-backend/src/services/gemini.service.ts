import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config';
import { logger } from '../config/logger';

export interface GeminiRequestParams {
  message: string;
  history?: Array<{ role: 'user' | 'model'; content: string }>;
}

export interface GeminiResponse {
  response: string;
  success: boolean;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  
  constructor() {
    if (!config.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    logger.info('Gemini API initialized with model: gemini-1.5-pro');
  }
  
  /**
   * Sends a message to the Gemini API and returns the response
   * @param params - The request parameters including message and optional conversation history
   * @returns The response from Gemini API
   */
  public async generateResponse(params: GeminiRequestParams): Promise<GeminiResponse> {
    try {
      const { message, history = [] } = params;
      
      logger.info('Sending request to Gemini API', { 
        messageLength: message.length,
        historyLength: history.length 
      });
      
      // For simple requests without history, use a direct approach
      if (history.length === 0) {
        const result = await this.model.generateContent(message);
        const response = result.response.text();
        
        logger.info('Gemini API response generated successfully', { responseLength: response.length });
        return {
          response,
          success: true
        };
      }
      
      // For requests with history, use the chat approach
      const chat = this.model.startChat({
        history: history.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        })),
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      });
      
      // Send the message to Gemini
      const result = await chat.sendMessage(message);
      const response = result.response.text();
      
      logger.info('Gemini API response generated successfully', { responseLength: response.length });
      return {
        response,
        success: true
      };
    } catch (error) {
      logger.error('Error generating response from Gemini API', { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Try a fallback approach with a different model if the first one fails
      try {
        logger.info('Attempting fallback with gemini-1.0-pro model');
        const fallbackModel = this.genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
        const result = await fallbackModel.generateContent(params.message);
        const response = result.response.text();
        
        logger.info('Fallback Gemini API response generated successfully');
        return {
          response,
          success: true
        };
      } catch (fallbackError) {
        logger.error('Fallback also failed', { 
          error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
        });
        
        return {
          response: 'I apologize for the technical difficulty. Here are some general well-being strategies: 1) Take deep breaths, 2) Step away for a short break, 3) Stretch your body, 4) Stay hydrated. How are you feeling right now?',
          success: false
        };
      }
    }
  }
} 