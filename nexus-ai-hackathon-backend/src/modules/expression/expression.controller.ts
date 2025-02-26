/**
 * Controller for expression/emotion detection endpoints
 */
import { Request, Response } from 'express';
import { EmotionDetectionService } from '../../services/emotion-detection.service';
import { logger } from '../../config/logger';

export class ExpressionController {
  private readonly emotionDetectionService: EmotionDetectionService;
  
  constructor() {
    this.emotionDetectionService = new EmotionDetectionService();
  }
  
  /**
   * Detects emotion from user text input
   * @param req - Express request object
   * @param res - Express response object
   */
  public detectEmotion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { text } = req.body;
      
      if (!text || typeof text !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Text input is required'
        });
        return;
      }
      
      const result = await this.emotionDetectionService.detectEmotion(text);
      
      res.status(200).json({
        success: true,
        emotion: result.emotion,
        confidence: result.confidence,
        details: result.details
      });
    } catch (error) {
      logger.error('Error in emotion detection endpoint', { 
        error: error instanceof Error ? error.message : String(error)
      });
      
      res.status(500).json({
        success: false,
        error: 'Failed to detect emotion',
        message: 'An error occurred while analyzing the text'
      });
    }
  }
} 