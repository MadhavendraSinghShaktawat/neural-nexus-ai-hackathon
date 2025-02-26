import { Request, Response } from 'express';
import { Router } from 'express';
import { MoodService } from './mood.service';
import { createMoodSchema } from './dto/create-mood.dto';
import { validateRequest } from '../../middleware/validate-request';
import { updateMoodSchema } from './dto/update-mood.dto';

export class MoodController {
  private moodService: MoodService;

  constructor() {
    this.moodService = new MoodService();
  }

  /**
   * Creates a new mood entry
   */
  public createMood = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createMoodSchema.parse(req.body);
      // Using a placeholder user ID since there's no authentication
      const userId = "default-user";
      const mood = await this.moodService.createMood(userId, validatedData);
      res.status(201).json(mood);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  /**
   * Gets mood history for a user with pagination and date filtering
   */
  public getMoodHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = "default-user";
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { startDate, endDate } = req.query;
      
      // Validate date formats if provided
      if (startDate && !isValidDateString(startDate as string)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid startDate format. Use YYYY-MM-DD'
        });
        return;
      }

      if (endDate && !isValidDateString(endDate as string)) {
        res.status(400).json({
          status: 'error',
          message: 'Invalid endDate format. Use YYYY-MM-DD'
        });
        return;
      }

      const moodHistory = await this.moodService.getMoodHistory(userId, {
        page,
        limit,
        startDate: startDate as string,
        endDate: endDate as string
      });

      res.status(200).json({
        status: 'success',
        data: moodHistory
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'Failed to retrieve mood history' 
      });
    }
  };

  /**
   * Gets a specific mood entry by ID
   */
  public getMoodById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { moodId } = req.params;
      const userId = "default-user";

      const mood = await this.moodService.getMoodById(userId, moodId);
      
      if (!mood) {
        res.status(404).json({
          status: 'error',
          message: 'Mood entry not found'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: mood
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'Failed to retrieve mood entry'
      });
    }
  };

  /**
   * Updates a specific mood entry
   */
  public updateMood = async (req: Request, res: Response): Promise<void> => {
    try {
      const { moodId } = req.params;
      const userId = "default-user";

      // Validate update data
      const validatedData = updateMoodSchema.parse(req.body);
      
      const updatedMood = await this.moodService.updateMood(
        userId,
        moodId,
        validatedData
      );
      
      if (!updatedMood) {
        res.status(404).json({
          status: 'error',
          message: 'Mood entry not found'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: updatedMood
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
          message: 'Failed to update mood entry'
        });
      }
    }
  };

  /**
   * Deletes a specific mood entry
   */
  public deleteMood = async (req: Request, res: Response): Promise<void> => {
    try {
      const { moodId } = req.params;
      const userId = "default-user";

      const isDeleted = await this.moodService.deleteMood(userId, moodId);
      
      if (!isDeleted) {
        res.status(404).json({
          status: 'error',
          message: 'Mood entry not found'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Mood entry deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'Failed to delete mood entry'
      });
    }
  };

  /**
   * Gets mood statistics and trends
   */
  public getMoodStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = "default-user";
      const stats = await this.moodService.getMoodStats(userId);
      
      res.status(200).json({
        status: 'success',
        data: stats
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'Failed to retrieve mood statistics'
      });
    }
  };
}

// Helper function to validate date string format
function isValidDateString(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// Route setup
const router = Router();
const moodController = new MoodController();

// Create mood entry
router.post(
  '/',
  validateRequest(createMoodSchema),
  moodController.createMood
);

// Get mood history
router.get('/', moodController.getMoodHistory);

// Get mood statistics
router.get('/stats', moodController.getMoodStats);

// Routes with parameters should come last
router.get('/:moodId', moodController.getMoodById);
router.put('/:moodId', validateRequest(updateMoodSchema), moodController.updateMood);
router.delete('/:moodId', moodController.deleteMood);

export { router as moodRouter }; 