import mongoose from 'mongoose';
import { Exercise } from '../modules/exercises/exercises.model';
import { config } from '../config/env.config';

const exercises = [
  {
    title: "Thought Record",
    description: "Track and analyze negative thoughts to identify patterns.",
    category: "depression",
    difficulty: "beginner",
    duration: 15,
    steps: [
      "Identify the triggering situation.",
      "Write down your automatic thoughts.",
      "Note your emotional response.",
      "Look for evidence that supports and challenges these thoughts.",
      "Develop a balanced perspective."
    ],
    benefits: [
      "Increased awareness of thought patterns.",
      "Better emotional regulation.",
      "Improved problem-solving skills."
    ],
    isActive: true
  },
  {
    title: "Journaling",
    description: "Write down your thoughts and feelings to process emotions.",
    category: "sadness",
    difficulty: "beginner",
    duration: 20,
    steps: [
      "Find a quiet place to write.",
      "Set a timer for 20 minutes.",
      "Write freely about your thoughts and feelings."
    ],
    benefits: [
      "Helps in processing emotions.",
      "Improves self-awareness.",
      "Can reduce feelings of isolation."
    ],
    isActive: true
  },
  {
    title: "Mindfulness Meditation",
    description: "Practice mindfulness to stay present and reduce anxiety.",
    category: "anxiety",
    difficulty: "intermediate",
    duration: 10,
    steps: [
      "Find a comfortable position.",
      "Close your eyes and focus on your breath.",
      "If your mind wanders, gently bring it back to your breath."
    ],
    benefits: [
      "Reduces stress and anxiety.",
      "Improves focus and concentration.",
      "Enhances emotional regulation."
    ],
    isActive: true
  },
  {
    title: "Social Connection",
    description: "Reach out to a friend or family member to talk.",
    category: "loneliness",
    difficulty: "beginner",
    duration: 30,
    steps: [
      "Identify someone you trust.",
      "Send them a message or call them.",
      "Share your feelings and listen to their perspective."
    ],
    benefits: [
      "Reduces feelings of loneliness.",
      "Strengthens social bonds.",
      "Provides emotional support."
    ],
    isActive: true
  },
  {
    title: "Gratitude List",
    description: "Write down things you are grateful for to shift focus.",
    category: "sadness",
    difficulty: "beginner",
    duration: 10,
    steps: [
      "Take a piece of paper.",
      "List at least five things you are grateful for.",
      "Reflect on why you are grateful for each item."
    ],
    benefits: [
      "Improves mood.",
      "Enhances overall well-being.",
      "Encourages positive thinking."
    ],
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    await Exercise.deleteMany({}); // Clear existing exercises
    await Exercise.insertMany(exercises); // Insert new exercises
    console.log('Database seeded with exercises');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase(); 