import { Request, Response, NextFunction } from 'express';
import { ExercisesService, ExerciseFilters } from './exercises.service';

export class ExercisesController {
  private readonly exercisesService: ExercisesService;

  constructor() {
    this.exercisesService = new ExercisesService();
  }

  public async getExercises(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: ExerciseFilters = {
        category: req.query.category as string,
        difficulty: req.query.difficulty as 'beginner' | 'intermediate' | 'advanced',
        duration: req.query.duration ? parseInt(req.query.duration as string) : undefined
      };

      const exercises = await this.exercisesService.getExercises(filters);
      res.status(200).json({
        status: 'success',
        data: exercises
      });
    } catch (err) {
      next(err);
    }
  }

  public async getRandomExercise(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category } = req.query;
      const exercise = await this.exercisesService.getRandomExercise(category as string);
      
      if (!exercise) {
        res.status(404).json({
          status: 'error',
          message: 'No exercises found'
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: exercise
      });
    } catch (err) {
      next(err);
    }
  }
} 