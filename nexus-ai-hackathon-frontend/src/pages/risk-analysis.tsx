import React, { useEffect, useState } from 'react';
import ActivityTrendsChart from '../components/risk-analysis/activity-trends-chart';
import RiskPredictionCard from '../components/risk-analysis/risk-prediction-card';
import BehavioralInsights from '../components/risk-analysis/behavioral-insights';
import RiskFactorsTable from '../components/risk-analysis/risk-factors-table';
import { fetchChildRiskData } from '../services/risk-analysis-service';
import { ChildRiskData } from '../types/risk-analysis-types';
import LoadingSpinner from '../components/common/loading-spinner';
import ErrorAlert from '../components/common/error-alert';

/**
 * Risk Analysis Page - Provides insights into a child's behavioral patterns
 * and predicts potential risks based on historical data
 */
const RiskAnalysisPage: React.FC = () => {
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [timeRange, setTimeRange] = useState<string>('3months');
  const [data, setData] = useState<ChildRiskData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch risk analysis data for the selected child
  useEffect(() => {
    if (!selectedChildId) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchChildRiskData(selectedChildId, timeRange);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedChildId, timeRange]);

  // Load the first child by default or from user preferences
  useEffect(() => {
    // This would typically come from a user context or parent selection component
    const defaultChildId = localStorage.getItem('lastSelectedChildId') || '';
    if (defaultChildId) {
      setSelectedChildId(defaultChildId);
    }
  }, []);

  const handleChildChange = (childId: string) => {
    setSelectedChildId(childId);
    localStorage.setItem('lastSelectedChildId', childId);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  if (error) {
    return <ErrorAlert message="Failed to load risk analysis data" error={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Risk Analysis</h1>
        <p className="text-gray-600">
          Monitor behavioral patterns and identify potential risks for early intervention
        </p>
      </div>

      {/* Controls for child selection and time range */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-full md:w-auto">
          <label htmlFor="childSelect" className="block text-sm font-medium text-gray-700 mb-1">
            Select Child
          </label>
          <select
            id="childSelect"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={selectedChildId}
            onChange={(e) => handleChildChange(e.target.value)}
          >
            <option value="">Select a child</option>
            {/* This would be populated from a context or API call */}
            <option value="child1">Emma Johnson</option>
            <option value="child2">Noah Smith</option>
          </select>
        </div>

        <div className="w-full md:w-auto">
          <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 mb-1">
            Time Range
          </label>
          <select
            id="timeRange"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Loading risk analysis data..." />
      ) : !selectedChildId ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Please select a child to view risk analysis</p>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity trends visualization */}
          <div className="col-span-1 lg:col-span-2">
            <ActivityTrendsChart activityData={data.activityTrends} />
          </div>
          
          {/* Risk prediction cards */}
          <div className="space-y-6">
            <RiskPredictionCard 
              title="Depression Risk" 
              riskLevel={data.riskPredictions.depression.level}
              riskScore={data.riskPredictions.depression.score}
              riskFactors={data.riskPredictions.depression.factors}
              recommendations={data.riskPredictions.depression.recommendations}
            />
            <RiskPredictionCard 
              title="Anxiety Risk" 
              riskLevel={data.riskPredictions.anxiety.level}
              riskScore={data.riskPredictions.anxiety.score}
              riskFactors={data.riskPredictions.anxiety.factors}
              recommendations={data.riskPredictions.anxiety.recommendations}
            />
            <RiskPredictionCard 
              title="Social Withdrawal Risk" 
              riskLevel={data.riskPredictions.socialWithdrawal.level}
              riskScore={data.riskPredictions.socialWithdrawal.score}
              riskFactors={data.riskPredictions.socialWithdrawal.factors}
              recommendations={data.riskPredictions.socialWithdrawal.recommendations}
            />
          </div>
          
          {/* Behavioral insights and risk factors */}
          <div className="space-y-6">
            <BehavioralInsights insights={data.behavioralInsights} />
            <RiskFactorsTable factors={data.contributingFactors} />
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
};

export default RiskAnalysisPage; 