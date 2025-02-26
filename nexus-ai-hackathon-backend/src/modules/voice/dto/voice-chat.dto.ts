import { z } from 'zod';

export const voiceChatSchema = z.object({
  text: z.string().min(1, "Voice input cannot be empty").max(1000),
  context: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional()
});

export type VoiceChatDto = z.infer<typeof voiceChatSchema>; 