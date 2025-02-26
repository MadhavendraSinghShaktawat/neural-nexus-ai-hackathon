import { GoogleGenerativeAI } from '@google/generative-ai';
import { createChatPrompt } from './prompt-template';
import { config } from '../config/env.config';

export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: string = 'gemini-pro';
  private readonly maxRetries: number = 3;
  private readonly retryDelay: number = 1000; // 1 second

  constructor() {
    if (!config.geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getFallbackResponse(context: string): string {
    // Provide helpful fallback responses based on common scenarios
    if (context.toLowerCase().includes('exhausted') || context.toLowerCase().includes('tired')) {
      return "I understand you're feeling exhausted. Here are some quick strategies: 1) Take a 10-minute power nap, 2) Get some fresh air, 3) Drink water and have a light snack, 4) Do some light stretching. Remember to take regular breaks to maintain your energy levels.";
    }
    if (context.toLowerCase().includes('focus') || context.toLowerCase().includes('concentrate')) {
      return "To help with focus: 1) Break your work into 25-minute chunks with 5-minute breaks, 2) Remove distractions from your workspace, 3) Use background white noise if it helps, 4) Stay hydrated and have healthy snacks nearby.";
    }
    return "I apologize for the technical difficulty. Here are some general well-being strategies: 1) Take deep breaths, 2) Step away for a short break, 3) Stretch your body, 4) Stay hydrated. How are you feeling right now?";
  }

  public async generateResponse(message: string): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const model = this.genAI.getGenerativeModel({ model: this.model });
        const prompt = createChatPrompt(message, '');
        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        lastError = error as Error;
        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    console.error('All retry attempts failed:', lastError);
    return this.getFallbackResponse(message);
  }
} 