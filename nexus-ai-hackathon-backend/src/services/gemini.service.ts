import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config';
import { logger } from '../config/logger';
import axios from 'axios';

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
  private apiKey: string;
  
  constructor() {
    this.apiKey = config.GEMINI_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    logger.info('Gemini API initialized with model: gemini-1.5-flash');
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
      
      // Try using the library first
      try {
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
      } catch (error: unknown) {
        // If the library approach fails, try using axios directly
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.warn('Library approach failed, trying direct API call', { error: errorMessage });
        
        const directApiResponse = await this.makeDirectApiCall(message);
        return directApiResponse;
      }
    } catch (error) {
      logger.error('Error generating response from Gemini API', { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Return fallback response
      return {
        response: 'I apologize for the technical difficulty. Here are some general well-being strategies: 1) Take deep breaths, 2) Step away for a short break, 3) Stretch your body, 4) Stay hydrated. How are you feeling right now?',
        success: false
      };
    }
  }
  
  /**
   * Makes a direct API call to Gemini using axios
   * @param message - The message to send
   * @returns The response from Gemini API
   */
  private async makeDirectApiCall(message: string): Promise<GeminiResponse> {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: message
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const text = response.data.candidates[0]?.content?.parts[0]?.text || '';
      
      logger.info('Direct API call successful', { responseLength: text.length });
      
      return {
        response: text,
        success: true
      };
    } catch (error) {
      logger.error('Direct API call failed', { 
        error: error instanceof Error ? error.message : String(error)
      });
      
      // Return fallback response instead of throwing
      return {
        response: 'I apologize for the technical difficulty. Here are some general well-being strategies: 1) Take deep breaths, 2) Step away for a short break, 3) Stretch your body, 4) Stay hydrated. How are you feeling right now?',
        success: false
      };
    }
  }
} 