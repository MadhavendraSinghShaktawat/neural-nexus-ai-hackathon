import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EmotionDistributionChartProps {
  distribution: Array<{
    rating: number;
    count: number;
  }>;
}

const EmotionDistributionChart: React.FC<EmotionDistributionChartProps> = ({ distribution }) => {
  // Helper function to get mood label
  const getMoodLabel = (rating: number) => {
    if (rating === 1) return 'Terrible';
    if (rating === 2) return 'Bad';
    if (rating === 3) return 'Poor';
    if (rating === 4) return 'Meh';
    if (rating === 5) return 'Okay';
    if (rating === 6) return 'Fine';
    if (rating === 7) return 'Good';
    if (rating === 8) return 'Great';
    if (rating === 9) return 'Amazing';
    if (rating === 10) return 'Excellent';
    return '';
  };

  // Prepare data for chart
  const chartData = distribution.map(item => ({
    ...item,
    label: getMoodLabel(item.rating)
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-sm rounded-md">
          <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Emotion Distribution</h2>
      
      {chartData.every(item => item.count === 0) ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No mood data available for the selected period
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="rating" 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default EmotionDistributionChart; 