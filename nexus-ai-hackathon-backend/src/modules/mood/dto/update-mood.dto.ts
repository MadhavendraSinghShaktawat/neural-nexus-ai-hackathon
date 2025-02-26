import { z } from 'zod';

export const updateMoodSchema = z.object({
  rating: z.number().min(1).max(10).optional(),
  description: z.string().max(500).optional(),
  tags: z.array(z.string().max(30)).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
});

export type UpdateMoodDto = z.infer<typeof updateMoodSchema>; 