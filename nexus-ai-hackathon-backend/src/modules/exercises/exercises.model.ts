import mongoose, { Schema, Document } from 'mongoose';

export interface IExercise extends Document {
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  steps: string[];
  benefits: string[];
  isActive: boolean;
}

const ExerciseSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    index: true 
  },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner' 
  },
  duration: { 
    type: Number, 
    required: true 
  },
  steps: [{ 
    type: String, 
    required: true 
  }],
  benefits: [{ 
    type: String, 
    required: true 
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  }
});

export const Exercise = mongoose.model<IExercise>('Exercise', ExerciseSchema); 