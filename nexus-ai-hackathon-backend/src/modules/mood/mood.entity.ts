import mongoose, { Schema, Document } from 'mongoose';

export interface IMood extends Document {
  userId: string;
  rating: number;
  description: string;
  tags: string[];
  createdAt: Date;
}

const MoodSchema = new Schema<IMood>({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 10 
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 500 
  },
  tags: [{ 
    type: String,
    maxlength: 30 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
});

export const Mood = mongoose.model<IMood>('Mood', MoodSchema); 