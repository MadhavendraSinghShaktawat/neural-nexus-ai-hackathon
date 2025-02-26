import { SentimentAnalysisData, TherapyRecommendation } from '../../types/report-types';

export const mockSentimentData: SentimentAnalysisData = {
  overallSentiment: 'Moderately Positive',
  sentimentScore: 0.62,
  emotionalTone: {
    joy: 0.45,
    sadness: 0.15,
    anxiety: 0.25,
    anger: 0.05,
    neutral: 0.10
  },
  keyThemes: [
    { theme: 'School Performance', sentiment: 'Mixed', frequency: 'High' },
    { theme: 'Peer Relationships', sentiment: 'Positive', frequency: 'Medium' },
    { theme: 'Family Dynamics', sentiment: 'Neutral', frequency: 'Low' },
    { theme: 'Self-Image', sentiment: 'Negative', frequency: 'Medium' },
    { theme: 'Future Plans', sentiment: 'Positive', frequency: 'Low' }
  ],
  linguisticPatterns: [
    'Frequent use of absolutist terms ("never", "always")',
    'Self-referential language patterns',
    'Cognitive distortions: catastrophizing, black-and-white thinking',
    'Avoidance language when discussing academic challenges'
  ]
};

export const mockTherapyRecommendations: TherapyRecommendation[] = [
  {
    area: 'Cognitive Restructuring',
    description: 'To address identified cognitive distortions and negative thought patterns. CBT techniques focusing on challenging absolutist thinking and catastrophizing.',
    priority: 'High'
  },
  {
    area: 'Emotional Regulation',
    description: 'To help manage anxiety spikes identified in conversation analysis. Mindfulness-based interventions and grounding techniques.',
    priority: 'Medium'
  },
  {
    area: 'Social Skills Development',
    description: 'To strengthen peer relationships and reduce social anxiety. Role-playing exercises and graduated exposure to social situations.',
    priority: 'Medium'
  },
  {
    area: 'Academic Confidence',
    description: 'To address performance anxiety and avoidance behaviors. Goal-setting, study skills training, and positive reinforcement.',
    priority: 'High'
  }
]; 