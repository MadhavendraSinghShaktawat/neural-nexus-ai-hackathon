import mongoose, { Schema, Document } from 'mongoose';

// Define the interface first
export interface ICheckin extends Document {
  userId: string;
  mood: {
    rating: number;
    description: string;
  };
  activities: string[];
  thoughts: string;
  gratitude: {
    category: string;
    detail: string;
  }[];
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

const CheckinSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  mood: {
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
    }
  },
  activities: [{
    type: String,
    maxlength: 50
  }],
  thoughts: {
    type: String,
    required: true,
    maxlength: 1000
  },
  gratitude: [{
    category: {
      type: String,
      maxlength: 200
    },
    detail: {
      type: String,
      maxlength: 200
    }
  }],
  goals: {
    completed: [{
      type: String,
      maxlength: 100
    }],
    upcoming: [{
      type: String,
      maxlength: 100
    }]
  },
  sleep: {
    hours: {
      type: Number,
      required: true,
      min: 0,
      max: 24
    },
    quality: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Add index for querying latest check-in
CheckinSchema.index({ userId: 1, createdAt: -1 });

export const Checkin = mongoose.model<ICheckin>('Checkin', CheckinSchema); 