import express from 'express';
import { moodRouter } from './modules/mood/mood.controller';
import { voiceRouter } from './modules/voice/voice.controller';

const app = express();

app.use(express.json());
app.use('/moods', moodRouter);
app.use('/api/voice', voiceRouter);

// ... rest of your app setup 

export { app }; 