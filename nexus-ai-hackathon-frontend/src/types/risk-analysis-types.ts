export interface ActivityTrendData {
  date: string;
  activityLevel: number;
  socialEngagement: number;
  emotionalStability: number;
  notes?: string;
}

export interface RiskFactor {
  name: string;
  category: string;
  impact?: 'low' | 'medium' | 'high';
  description?: string;
}

export interface RiskPrediction {
  level: 'low' | 'moderate' | 'high' | 'severe';
  score: number;
  factors: RiskFactor[];
  recommendations: string[];
}

export interface BehavioralTrend {
  direction: 'improving' | 'worsening' | 'stable';
  description: string;
}

export interface BehavioralInsight {
  category: string;
  description: string;
  trend?: BehavioralTrend;
  significance?: string;
}

export interface ChildRiskData {
  childId: string;
  activityTrends: ActivityTrendData[];
  riskPredictions: {
    depression: RiskPrediction;
    anxiety: RiskPrediction;
    socialWithdrawal: RiskPrediction;
  };
  behavioralInsights: BehavioralInsight[];
  contributingFactors: RiskFactor[];
  lastUpdated: string;
} 