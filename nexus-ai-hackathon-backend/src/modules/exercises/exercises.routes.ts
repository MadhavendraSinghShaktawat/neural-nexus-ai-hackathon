import { Router } from 'express';
import { ExercisesController } from './exercises.controller';
import { chatLimiter } from '../../middleware/rate-limiter';

const router = Router();
const exercisesController = new ExercisesController();

// Apply rate limiting
router.use(chatLimiter);

// [GET] /api/exercises - Get list of exercises with optional filters
router.get('/', (req, res, next) => exercisesController.getExercises(req, res, next));

// [GET] /api/exercises/random - Get a random exercise
router.get('/random', (req, res, next) => exercisesController.getRandomExercise(req, res, next));

export const exercisesRoutes = router; 