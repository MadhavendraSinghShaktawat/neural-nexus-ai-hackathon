import React from 'react';
import { BehavioralInsight } from '../../types/risk-analysis-types';

interface BehavioralInsightsProps {
  insights: BehavioralInsight[];
}

/**
 * Displays key behavioral insights derived from the child's historical data
 */
const BehavioralInsights: React.FC<BehavioralInsightsProps> = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Behavioral Insights</h3>
        <p className="text-gray-500">No insights available at this time.</p>
      </div>
    );
  }

  const getCategoryIcon = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'social':
        return '👥';
      case 'emotional':
        return '😊';
      case 'academic':
        return '📚';
      case 'physical':
        return '🏃';
      case 'sleep':
        return '😴';
      default:
        return '📊';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'social':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'emotional':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'academic':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'physical':
        return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'sleep':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Behavioral Insights</h3>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <div className={`px-4 py-3 border-b ${getCategoryColor(insight.category)}`}>
              <div className="flex items-center">
                <span className="text-xl mr-2">{getCategoryIcon(insight.category)}</span>
                <h4 className="font-medium">{insight.category} Pattern</h4>
              </div>
            </div>
            
            <div className="p-4">
              <p className="text-gray-700 mb-3">{insight.description}</p>
              
              {insight.trend && (
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="font-medium mr-2">Trend:</span>
                  <span className={`inline-flex items-center ${
                    insight.trend.direction === 'improving' ? 'text-green-600' : 
                    insight.trend.direction === 'worsening' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {insight.trend.direction === 'improving' && '↗ '}
                    {insight.trend.direction === 'worsening' && '↘ '}
                    {insight.trend.direction === 'stable' && '→ '}
                    {insight.trend.description}
                  </span>
                </div>
              )}
              
              {insight.significance && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium mr-2">Significance:</span>
                  {insight.significance}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BehavioralInsights; 