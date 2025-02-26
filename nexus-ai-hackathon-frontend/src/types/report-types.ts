export interface TherapyRecommendation {
  area: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface SentimentAnalysisData {
  overallSentiment: string;
  sentimentScore: number;
  emotionalTone: {
    joy: number;
    sadness: number;
    anxiety: number;
    anger: number;
    neutral: number;
  };
  keyThemes: Array<{
    theme: string;
    sentiment: string;
    frequency: string;
  }>;
  linguisticPatterns: string[];
} 