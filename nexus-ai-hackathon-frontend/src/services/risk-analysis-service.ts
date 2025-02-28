import { ChildRiskData } from '../types/risk-analysis-types';

/**
 * Fetches risk analysis data for a specific child over a given time range
 * @param childId - The ID of the child to fetch data for
 * @param timeRange - The time range to analyze (e.g., '1month', '3months')
 * @returns Promise with the child's risk analysis data
 */
export const fetchChildRiskData = async (
  childId: string, 
  timeRange: string
): Promise<ChildRiskData> => {
  try {
    // In a real application, this would be an API call
    // For now, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This would be replaced with actual API data
    return getMockRiskData(childId, timeRange);
  } catch (error) {
    console.error('Error fetching risk analysis data:', error);
    throw new Error('Failed to fetch risk analysis data');
  }
};

/**
 * Generates mock risk data for demonstration purposes
 * In a real application, this would be replaced with actual API calls
 */
const getMockRiskData = (childId: string, timeRange: string): ChildRiskData => {
  // Generate dates based on the selected time range
  const dates = generateDateRange(timeRange);
  
  // Create mock activity trend data
  const activityTrends = dates.map((date, index) => {
    // Create some patterns in the data
    const baseActivity = 70 - (index % 3 === 0 ? 15 : 0);
    const baseSocial = 65 - (index % 4 === 0 ? 20 : 0);
    const baseEmotional = 75 - (index % 5 === 0 ? 25 : 0);
    
    // Add some randomness
    return {
      date,
      activityLevel: Math.max(0, Math.min(100, baseActivity + Math.floor(Math.random() * 10))),
      socialEngagement: Math.max(0, Math.min(100, baseSocial + Math.floor(Math.random() * 10))),
      emotionalStability: Math.max(0, Math.min(100, baseEmotional + Math.floor(Math.random() * 10))),
      notes: index % 7 === 0 ? 'Notable change in behavior observed' : undefined,
    };
  });
  
  // Create mock risk predictions
  const riskPredictions = {
    depression: {
      level: childId === 'child1' ? 'moderate' : 'low',
      score: childId === 'child1' ? 45 : 25,
      factors: [
        { name: 'Decreased social activity', category: 'Social', impact: 'high' },
        { name: 'Changes in sleep patterns', category: 'Physical', impact: 'medium' },
        { name: 'Reduced interest in hobbies', category: 'Emotional', impact: 'medium' },
      ],
      recommendations: [
        'Schedule regular social activities',
        'Maintain consistent sleep schedule',
        'Encourage participation in favorite hobbies',
        'Consider speaking with a child psychologist',
      ],
    },
    anxiety: {
      level: childId === 'child2' ? 'high' : 'moderate',
      score: childId === 'child2' ? 65 : 40,
      factors: [
        { name: 'Excessive worry about school', category: 'Academic', impact: 'high' },
        { name: 'Physical complaints before school', category: 'Physical', impact: 'medium' },
        { name: 'Difficulty concentrating', category: 'Academic', impact: 'medium' },
      ],
      recommendations: [
        'Practice relaxation techniques',
        'Establish predictable routines',
        'Break large tasks into smaller steps',
        'Consider anxiety-reduction strategies with a professional',
      ],
    },
    socialWithdrawal: {
      level: childId === 'child1' ? 'high' : 'low',
      score: childId === 'child1' ? 70 : 20,
      factors: [
        { name: 'Declining participation in group activities', category: 'Social', impact: 'high' },
        { name: 'Preference for solitary activities', category: 'Social', impact: 'medium' },
        { name: 'Reduced communication with peers', category: 'Social', impact: 'high' },
      ],
      recommendations: [
        'Encourage small group interactions',
        'Build social skills through structured activities',
        'Identify and address potential bullying or social issues',
        'Create opportunities for positive peer interactions',
      ],
    },
  } as const;
  
  // Create mock behavioral insights
  const behavioralInsights = [
    {
      category: 'Social',
      description: 'Shows a pattern of decreasing social engagement over weekends, but maintains consistent interaction during weekdays.',
      trend: {
        direction: 'worsening',
        description: 'Gradual decline in social participation over the past month',
      },
      significance: 'May indicate developing social anxiety in less structured environments',
    },
    {
      category: 'Emotional',
      description: 'Emotional stability fluctuates significantly, with notable drops following academic assessments.',
      trend: {
        direction: 'stable',
        description: 'Consistent pattern of emotional responses to academic stress',
      },
      significance: 'Suggests sensitivity to performance evaluation and potential perfectionism',
    },
    {
      category: 'Academic',
      description: 'Activity levels show consistent engagement during structured learning activities.',
      trend: {
        direction: 'improving',
        description: 'Increasing focus and participation in academic settings',
      },
      significance: 'Positive response to current educational environment',
    },
  ];
  
  // Create mock contributing factors
  const contributingFactors = [
    { name: 'Recent change in school environment', category: 'Academic', impact: 'high' },
    { name: 'Peer relationship difficulties', category: 'Social', impact: 'high' },
    { name: 'Inconsistent daily routine', category: 'Lifestyle', impact: 'medium' },
    { name: 'Limited physical activity', category: 'Physical', impact: 'medium' },
    { name: 'High academic expectations', category: 'Academic', impact: 'medium' },
    { name: 'Digital device overuse', category: 'Lifestyle', impact: 'low' },
    { name: 'Irregular sleep schedule', category: 'Physical', impact: 'high' },
  ];
  
  return {
    childId,
    activityTrends,
    riskPredictions,
    behavioralInsights,
    contributingFactors,
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Generates an array of dates based on the selected time range
 */
const generateDateRange = (timeRange: string): string[] => {
  const dates: string[] = [];
  const today = new Date();
  let daysToGenerate = 30;
  
  switch (timeRange) {
    case '1month':
      daysToGenerate = 30;
      break;
    case '3months':
      daysToGenerate = 90;
      break;
    case '6months':
      daysToGenerate = 180;
      break;
    case '1year':
      daysToGenerate = 365;
      break;
    default:
      daysToGenerate = 30;
  }
  
  // Generate dates at regular intervals
  const interval = Math.max(1, Math.floor(daysToGenerate / 15)); // Limit to ~15 data points
  
  for (let i = daysToGenerate; i >= 0; i -= interval) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}; 