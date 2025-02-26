export interface ICheckin extends Document {
  userId: string;
  mood: {
    rating: number;
    description: string;
  };
  activities: string[];
  thoughts: string;
  gratitude: string[];
  goals: {
    completed: string[];
    upcoming: string[];
  };
  sleep: {
    hours: number;
    quality: number;
  };
  createdAt: Date;
} 