import { z } from 'zod';
import { 
  MOOD_DESCRIPTIONS, 
  ACTIVITIES, 
  GRATITUDE_CATEGORIES 
} from '../interfaces/checkin-options.interface';

export const updateCheckinSchema = z.object({
  mood: z.object({
    rating: z.number().min(1).max(10).optional(),
    description: z.enum(MOOD_DESCRIPTIONS).optional()
  }).optional(),
  activities: z.array(z.enum(ACTIVITIES))
    .min(1, "Select at least one activity")
    .max(5, "Maximum 5 activities allowed")
    .optional(),
  thoughts: z.string().max(1000).optional(),
  gratitude: z.array(z.object({
    category: z.enum(GRATITUDE_CATEGORIES),
    detail: z.string().max(200)
  }))
    .min(1, "Share at least one gratitude")
    .max(3, "Maximum 3 gratitudes allowed")
    .optional(),
  goals: z.object({
    completed: z.array(z.string().max(100)).optional(),
    upcoming: z.array(z.string().max(100)).optional()
  }).optional(),
  sleep: z.object({
    hours: z.number().min(0).max(24).optional(),
    quality: z.number().min(1).max(10).optional()
  }).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

export type UpdateCheckinDto = z.infer<typeof updateCheckinSchema>; 