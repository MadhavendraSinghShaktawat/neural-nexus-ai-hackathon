import { CreateMoodDto } from './dto/create-mood.dto';
import { UpdateMoodDto } from './dto/update-mood.dto';
import { Mood, IMood } from './mood.entity';
import { Error } from 'mongoose';
import { MoodStats, MoodTrend, TagFrequency } from './interfaces/mood-stats.interface';

interface PaginationOptions {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
}

interface PaginatedMoods {
  moods: IMood[];
  total: number;
  page: number;
  totalPages: number;
}

export class MoodService {
  /**
   * Creates a new mood entry for a user
   * @param userId - The ID of the user creating the mood
   * @param moodData - The mood data to create
   * @returns The created mood entry
   */
  public async createMood(userId: string, moodData: CreateMoodDto): Promise<IMood> {
    const mood = new Mood({
      userId,
      ...moodData,
      createdAt: new Date()
    });
    return await mood.save();
  }

  /**
   * Gets the most recent mood entry for a user
   * @param userId - The ID of the user
   * @returns The most recent mood entry or null if none exists
   */
  public async getLatestMood(userId: string): Promise<IMood | null> {
    return await Mood.findOne({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Gets paginated mood history for a user
   * @param userId - The ID of the user
   * @param options - Pagination and filter options
   * @returns Paginated mood entries
   */
  public async getMoodHistory(userId: string, options: PaginationOptions): Promise<PaginatedMoods> {
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

    const [moods, total] = await Promise.all([
      Mood.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Mood.countDocuments(query)
    ]);

    return {
      moods,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Gets a specific mood entry by ID
   * @param userId - The ID of the user
   * @param moodId - The ID of the mood entry
   * @returns The mood entry or null if not found
   */
  public async getMoodById(userId: string, moodId: string): Promise<IMood | null> {
    try {
      const mood = await Mood.findOne({ 
        _id: moodId,
        userId 
      }).exec();
      
      return mood;
    } catch (error) {
      // Handle invalid ObjectId format
      if (error instanceof Error.CastError) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Updates a specific mood entry
   * @param userId - The ID of the user
   * @param moodId - The ID of the mood entry
   * @param updateData - The data to update
   * @returns The updated mood entry or null if not found
   */
  public async updateMood(
    userId: string, 
    moodId: string, 
    updateData: UpdateMoodDto
  ): Promise<IMood | null> {
    try {
      const mood = await Mood.findOneAndUpdate(
        { _id: moodId, userId },
        { $set: updateData },
        { new: true } // Returns the updated document
      ).exec();
      
      return mood;
    } catch (error) {
      if (error instanceof Error.CastError) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Deletes a specific mood entry
   * @param userId - The ID of the user
   * @param moodId - The ID of the mood entry to delete
   * @returns true if mood was deleted, false if not found
   */
  public async deleteMood(userId: string, moodId: string): Promise<boolean> {
    try {
      const result = await Mood.findOneAndDelete({ 
        _id: moodId,
        userId 
      }).exec();
      
      return result !== null;
    } catch (error) {
      if (error instanceof Error.CastError) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Gets mood statistics and trends for a user
   * @param userId - The ID of the user
   * @returns Mood statistics and trends
   */
  public async getMoodStats(userId: string): Promise<MoodStats> {
    // Get all moods for the user
    const moods = await Mood.find({ userId }).exec();

    // Calculate overall statistics
    const ratings = moods.map(mood => mood.rating);
    const overallStats = {
      averageRating: this.calculateAverage(ratings),
      totalEntries: moods.length,
      highestRating: Math.max(...ratings),
      lowestRating: Math.min(...ratings)
    };

    // Calculate weekly trends (last 4 weeks)
    const weeklyTrends = await this.calculateTrends(userId, 'week', 4);

    // Calculate monthly trends (last 6 months)
    const monthlyTrends = await this.calculateTrends(userId, 'month', 6);

    // Calculate tag frequencies
    const popularTags = this.calculateTagFrequencies(moods);

    return {
      overallStats,
      weeklyTrends,
      monthlyTrends,
      popularTags
    };
  }

  /**
   * Calculates mood trends for a given time period
   */
  private async calculateTrends(
    userId: string, 
    period: 'week' | 'month', 
    limit: number
  ): Promise<MoodTrend[]> {
    const now = new Date();
    const trends: MoodTrend[] = [];

    for (let i = 0; i < limit; i++) {
      const startDate = new Date(now);
      if (period === 'week') {
        startDate.setDate(startDate.getDate() - (i * 7));
        startDate.setHours(0, 0, 0, 0);
      } else {
        startDate.setMonth(startDate.getMonth() - i);
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
      }

      const endDate = new Date(startDate);
      if (period === 'week') {
        endDate.setDate(endDate.getDate() + 7);
      } else {
        endDate.setMonth(endDate.getMonth() + 1);
      }

      const periodMoods = await Mood.find({
        userId,
        createdAt: {
          $gte: startDate,
          $lt: endDate
        }
      }).exec();

      const ratings = periodMoods.map(mood => mood.rating);
      
      trends.push({
        date: startDate.toISOString().split('T')[0],
        averageRating: this.calculateAverage(ratings),
        count: periodMoods.length
      });
    }

    return trends.reverse();
  }

  /**
   * Calculates tag frequencies from mood entries
   */
  private calculateTagFrequencies(moods: IMood[]): TagFrequency[] {
    const tagCounts = new Map<string, number>();

    moods.forEach(mood => {
      mood.tags?.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Return top 10 tags
  }

  /**
   * Calculates average of numbers, returns 0 for empty array
   */
  private calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    return Number((sum / numbers.length).toFixed(2));
  }
} 