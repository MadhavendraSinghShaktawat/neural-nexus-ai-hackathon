import { Request, Response } from 'express';
import { Router } from 'express';
import { VoiceService } from './voice.service';
import { validateRequest } from '../../middleware/validate-request';
import { voiceChatSchema } from './dto/voice-chat.dto';

export class VoiceController {
  private voiceService: VoiceService;

  constructor() {
    this.voiceService = new VoiceService();
  }

  /**
   * Start a new voice chat session
   */
  public startSession = async (_req: Request, res: Response): Promise<void> => {
    try {
      const session = this.voiceService.startSession();
      res.status(201).json({
        status: 'success',
        data: {
          sessionId: session.sessionId,
          createdAt: session.createdAt
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to start voice session'
      });
    }
  };

  /**
   * Process voice input and get AI response
   */
  public processVoiceChat = async (req: Request, res: Response): Promise<void> => {
    try {
      const { text, context } = voiceChatSchema.parse(req.body);
      const sessionId = req.headers['x-session-id'] as string;

      const result = await this.voiceService.processVoiceInput(
        text,
        context,
        sessionId
      );

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Failed to process voice chat'
        });
      }
    }
  };

  /**
   * End a voice chat session
   */
  public endSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionId = req.headers['x-session-id'] as string;
      
      if (!sessionId) {
        res.status(400).json({
          status: 'error',
          message: 'Session ID is required'
        });
        return;
      }

      const success = this.voiceService.endSession(sessionId);
      
      if (success) {
        res.status(200).json({
          status: 'success',
          message: 'Session ended successfully'
        });
      } else {
        res.status(404).json({
          status: 'error',
          message: 'Session not found'
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to end voice session'
      });
    }
  };
}

// Route setup - remove /api/voice prefix since it's handled in app.ts
const router = Router();
const voiceController = new VoiceController();

router.post('/session/start', voiceController.startSession);
router.post('/session/end', voiceController.endSession);
router.post('/chat', validateRequest(voiceChatSchema), voiceController.processVoiceChat);

export { router as voiceRouter }; 