import { CreateCheckinDto } from './dto/create-checkin.dto';
import { Checkin } from './checkin.entity';
import type { ICheckin } from './checkin.entity';
import { UpdateCheckinDto } from './dto/update-checkin.dto';
import mongoose from 'mongoose';

interface CheckinHistoryOptions {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
}

interface PaginatedCheckins {
  checkins: ICheckin[];
  total: number;
  page: number;
  totalPages: number;
}

export class CheckinService {
  /**
   * Creates a new daily check-in
   * @param userId - The ID of the user
   * @param checkinData - The check-in data
   * @returns The created check-in entry
   */
  public async createCheckin(userId: string, checkinData: CreateCheckinDto): Promise<ICheckin> {
    // Check if user already has a check-in for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingCheckin = await Checkin.findOne({
      userId,
      createdAt: {
        $gte: today
      }
    }).exec();

    if (existingCheckin) {
      throw new Error('You have already submitted a check-in for today');
    }

    const checkin = new Checkin({
      userId,
      ...checkinData,
      createdAt: new Date()
    });

    return await checkin.save();
  }

  /**
   * Gets user's check-in for today
   * @param userId - The ID of the user
   * @returns Today's check-in or null if not found
   */
  public async getTodayCheckin(userId: string): Promise<ICheckin | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayCheckin = await Checkin.findOne({
      userId,
      createdAt: {
        $gte: today
      }
    })
    .sort({ createdAt: -1 })
    .exec();

    return todayCheckin;
  }

  /**
   * Gets paginated check-in history for a user
   * @param userId - The ID of the user
   * @param options - Pagination and filter options
   * @returns Paginated check-in entries
   */
  public async getCheckinHistory(
    userId: string, 
    options: CheckinHistoryOptions
  ): Promise<PaginatedCheckins> {
    const { page, limit, startDate, endDate } = options;
    const skip = (page - 1) * limit;

    // Build query filters
    const query: any = { userId };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set to end of day for endDate
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDateTime;
      }
    }

    const [checkins, total] = await Promise.all([
      Checkin.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Checkin.countDocuments(query)
    ]);

    return {
      checkins,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Updates a specific check-in entry
   * @param userId - The ID of the user
   * @param checkinId - The ID of the check-in to update
   * @param updateData - The data to update
   * @returns The updated check-in or null if not found
   */
  public async updateCheckin(
    userId: string, 
    checkinId: string, 
    updateData: UpdateCheckinDto
  ): Promise<ICheckin | null> {
    try {
      const checkin = await Checkin.findOneAndUpdate(
        { _id: checkinId, userId },
        { $set: updateData },
        { new: true } // Returns the updated document
      ).exec();
      
      return checkin;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Deletes a specific check-in entry
   * @param userId - The ID of the user
   * @param checkinId - The ID of the check-in to delete
   * @returns true if check-in was deleted, false if not found
   */
  public async deleteCheckin(userId: string, checkinId: string): Promise<boolean> {
    try {
      const result = await Checkin.findOneAndDelete({ 
        _id: checkinId,
        userId 
      }).exec();
      
      return result !== null;
    } catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        return false;
      }
      throw error;
    }
  }
} 