import { z } from 'zod';

export const createMoodSchema = z.object({
  rating: z.number().min(1).max(10),
  description: z.string().max(500),
  tags: z.array(z.string().max(30)).optional()
});

export type CreateMoodDto = z.infer<typeof createMoodSchema>; 