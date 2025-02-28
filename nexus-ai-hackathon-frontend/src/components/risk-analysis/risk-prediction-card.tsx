import React from 'react';
import { RiskFactor } from '../../types/risk-analysis-types';

interface RiskPredictionCardProps {
  title: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  riskScore: number;
  riskFactors: RiskFactor[];
  recommendations: string[];
}

/**
 * Displays a prediction card for a specific risk category with severity level and recommendations
 */
const RiskPredictionCard: React.FC<RiskPredictionCardProps> = ({
  title,
  riskLevel,
  riskScore,
  riskFactors,
  recommendations,
}) => {
  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'severe':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (level: string): string => {
    switch (level) {
      case 'low':
        return 'bg-green-500';
      case 'moderate':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-orange-500';
      case 'severe':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        
        <div className="flex items-center mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
            <div 
              className={`h-2.5 rounded-full ${getProgressColor(riskLevel)}`} 
              style={{ width: `${riskScore}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-500 w-12">{riskScore}%</span>
        </div>
        
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getRiskColor(riskLevel)}`}>
          {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
        </div>
        
        {riskFactors.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Contributing Factors:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {riskFactors.map((factor, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {factor.name} {factor.impact && <span className="text-xs text-gray-500">({factor.impact} impact)</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-gray-600">{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskPredictionCard; 