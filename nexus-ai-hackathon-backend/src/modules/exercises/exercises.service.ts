import { Exercise, IExercise } from './exercises.model';

export interface ExerciseFilters {
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
}

interface ExerciseQuery {
  isActive: boolean;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: { $lte: number };
}

export class ExercisesService {
  public async getExercises(filters: ExerciseFilters = {}): Promise<IExercise[]> {
    try {
      const query: ExerciseQuery = { isActive: true };
      
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.difficulty) {
        query.difficulty = filters.difficulty;
      }
      if (filters.duration) {
        query.duration = { $lte: filters.duration };
      }

      const exercises = await Exercise.find(query)
        .sort({ difficulty: 1, duration: 1 })
        .limit(10)
        .exec();

      return exercises;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw new Error('Failed to fetch exercises');
    }
  }

  public async getRandomExercise(category?: string): Promise<IExercise | null> {
    try {
      const query: ExerciseQuery = { isActive: true };
      if (category) {
        query.category = category;
      }

      const count = await Exercise.countDocuments(query);
      const random = Math.floor(Math.random() * count);
      
      const exercise = await Exercise.findOne(query)
        .skip(random)
        .exec();

      return exercise;
    } catch (error) {
      console.error('Error fetching random exercise:', error);
      throw new Error('Failed to fetch random exercise');
    }
  }
} 