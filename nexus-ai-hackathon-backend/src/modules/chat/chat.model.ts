import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
}

const ChatSchema = new Schema({
  userId: { 
    type: String, 
    required: true,
    index: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  response: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

export const Chat = mongoose.model<IChat>('Chat', ChatSchema); 