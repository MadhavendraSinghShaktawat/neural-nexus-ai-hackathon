/**
 * Service for detecting emotions in user messages
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/config';
import { logger } from '../config/logger';
import axios from 'axios';

export interface EmotionDetectionResult {
  emotion: string;
  confidence: number;
  details?: string;
}

export class EmotionDetectionService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private apiKey: string;
  
  constructor() {
    this.apiKey = config.GEMINI_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    // Use gemini-1.5-flash for faster responses
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    logger.info('Emotion Detection Service initialized with model: gemini-1.5-flash');
  }
  
  /**
   * Detects emotion in a user message
   * @param message - The user message to analyze
   * @returns The detected emotion and confidence score
   */
  public async detectEmotion(message: string): Promise<EmotionDetectionResult> {
    try {
      const prompt = `
      Analyze the following message and determine the primary emotion expressed.
      
      Message: "${message}"
      
      Respond with a JSON object containing:
      1. "emotion": One of [happy, sad, angry, anxious, neutral, confused, excited, fearful]
      2. "confidence": A number between 0 and 1 indicating confidence in the assessment
      
      Only respond with the JSON object, nothing else.`;
      
      logger.info('Sending emotion detection request', { messageLength: message.length });
      
      try {
        const result = await this.model.generateContent(prompt);
        const response = result.response.text().trim();
        
        try {
          // Extract JSON from response (in case there's any extra text)
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          const jsonStr = jsonMatch ? jsonMatch[0] : response;
          const parsedResponse = JSON.parse(jsonStr);
          
          logger.info('Emotion detected successfully', { 
            emotion: parsedResponse.emotion,
            confidence: parsedResponse.confidence
          });
          
          return {
            emotion: parsedResponse.emotion,
            confidence: parsedResponse.confidence,
            details: parsedResponse.details
          };
        } catch (parseError) {
          logger.error('Error parsing emotion detection response', { 
            error: parseError,
            response
          });
          
          // Fallback to a default response if parsing fails
          return {
            emotion: 'neutral',
            confidence: 0.5,
            details: 'Failed to parse emotion detection response'
          };
        }
      } catch (apiError) {
        // Try direct API call if library approach fails
        logger.warn('Library approach failed for emotion detection, trying direct API call');
        return await this.makeDirectEmotionDetectionCall(message);
      }
    } catch (error) {
      logger.error('Error detecting emotion', { 
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        emotion: 'neutral',
        confidence: 0.5,
        details: 'Error occurred during emotion detection'
      };
    }
  }
  
  /**
   * Makes a direct API call to Gemini for emotion detection
   * @param message - The message to analyze
   * @returns The detected emotion result
   */
  private async makeDirectEmotionDetectionCall(message: string): Promise<EmotionDetectionResult> {
    try {
      const prompt = `
      Analyze the following message and determine the primary emotion expressed.
      
      Message: "${message}"
      
      Respond with a JSON object containing:
      1. "emotion": One of [happy, sad, angry, anxious, neutral, confused, excited, fearful]
      2. "confidence": A number between 0 and 1 indicating confidence in the assessment
      
      Only respond with the JSON object, nothing else.`;
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
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
      
      try {
        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : text;
        const parsedResponse = JSON.parse(jsonStr);
        
        return {
          emotion: parsedResponse.emotion,
          confidence: parsedResponse.confidence,
          details: parsedResponse.details
        };
      } catch (parseError) {
        logger.error('Error parsing direct emotion detection response', { error: parseError });
        return {
          emotion: 'neutral',
          confidence: 0.5,
          details: 'Failed to parse direct emotion detection response'
        };
      }
    } catch (error) {
      logger.error('Direct emotion detection API call failed', { 
        error: error instanceof Error ? error.message : String(error)
      });
      
      return {
        emotion: 'neutral',
        confidence: 0.5,
        details: 'Error in direct emotion detection API call'
      };
    }
  }
} 