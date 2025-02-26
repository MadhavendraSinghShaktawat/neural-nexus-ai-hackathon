import { Express } from 'express';
import { chatRoutes } from '../modules/chat/chat.routes';
import { exercisesRoutes } from '../modules/exercises/exercises.routes';
import { moodRouter } from '../modules/mood/mood.controller';
import { checkinRouter } from '../modules/mood/checkin.controller';
import { voiceRouter } from '../modules/voice/voice.controller';

export const configureRoutes = (app: Express): void => {
  app.use('/api/chat', chatRoutes);
  app.use('/api/exercises', exercisesRoutes);
  app.use('/api/moods', moodRouter);
  app.use('/api', checkinRouter);
  app.use('/api/voice', voiceRouter);
}; 