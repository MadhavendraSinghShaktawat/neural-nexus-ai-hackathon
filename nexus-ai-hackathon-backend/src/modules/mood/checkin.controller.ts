import { Request, Response } from 'express';
import { Router } from 'express';
import { CheckinService } from './checkin.service';
import { createCheckinSchema } from './dto/create-checkin.dto';
import { validateRequest } from '../../middleware/validate-request';
import { updateCheckinSchema } from './dto/update-checkin.dto';

export class CheckinController {
  private checkinService: CheckinService;

  constructor() {
    this.checkinService = new CheckinService();
  }

  /**
   * Submit a daily check-in
   */
  public createCheckin = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createCheckinSchema.parse(req.body);
      const userId = "default-user";

      const checkin = await this.checkinService.createCheckin(userId, validatedData);
      
      res.status(201).json({
        status: 'success',
        data: checkin
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'You have already submitted a check-in for today') {
          res.status(400).json({ 
            status: 'error',
            message: error.message 
          });
        } else {
          res.status(400).json({ 
            status: 'error',
            message: error.message 
          });
        }
      } else {
        res.status(500).json({ 
          status: 'error',
          message: 'Failed to create check-in'
        });
      }
    }
  };

  /**
   * Gets user's check-in for today
   */
  public getTodayCheckin = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = "default-user";
      const checkin = await this.checkinService.getTodayCheckin(userId);
      
      if (!checkin) {
        res.status(404).json({
          status: 'error',
          message: 'No check-in found for today'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: checkin
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'Failed to retrieve today\'s check-in'
      });
    }
  };

  /**
   * Gets check-in history for a user with pagination and date filtering
   */
  public getCheckinHistory = async (req: Request, res: Response): Promise<void> => {
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

      const checkinHistory = await this.checkinService.getCheckinHistory(userId, {
        page,
        limit,
        startDate: startDate as string,
        endDate: endDate as string
      });

      res.status(200).json({
        status: 'success',
        data: checkinHistory
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'Failed to retrieve check-in history'
      });
    }
  };

  /**
   * Updates a specific check-in entry
   */
  public updateCheckin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = "default-user";

      // Validate update data
      const validatedData = updateCheckinSchema.parse(req.body);
      
      const updatedCheckin = await this.checkinService.updateCheckin(
        userId,
        id,
        validatedData
      );
      
      if (!updatedCheckin) {
        res.status(404).json({
          status: 'error',
          message: 'Check-in entry not found'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: updatedCheckin
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
          message: 'Failed to update check-in entry'
        });
      }
    }
  };

  /**
   * Deletes a specific check-in entry
   */
  public deleteCheckin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = "default-user";

      const isDeleted = await this.checkinService.deleteCheckin(userId, id);
      
      if (!isDeleted) {
        res.status(404).json({
          status: 'error',
          message: 'Check-in entry not found'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Check-in entry deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        status: 'error',
        message: 'Failed to delete check-in entry'
      });
    }
  };
}

// Helper function to validate date string format (if not already defined)
function isValidDateString(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// Route setup
const router = Router();
const checkinController = new CheckinController();

router.post('/checkins', validateRequest(createCheckinSchema), checkinController.createCheckin);
router.get('/checkins/today', checkinController.getTodayCheckin);
router.get('/checkins/history', checkinController.getCheckinHistory);
router.put('/checkins/:id', validateRequest(updateCheckinSchema), checkinController.updateCheckin);
router.delete('/checkins/:id', checkinController.deleteCheckin);

export { router as checkinRouter }; 