import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartOptions
} from 'chart.js';
import { ActivityTrendData } from '../../types/risk-analysis-types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ActivityTrendsChartProps {
  activityData: ActivityTrendData[];
}

/**
 * Visualizes changes in a child's activity, participation, and engagement patterns over time
 */
const ActivityTrendsChart: React.FC<ActivityTrendsChartProps> = ({ activityData }) => {
  const chartData = useMemo(() => {
    const labels = activityData.map(item => item.date);
    
    return {
      labels,
      datasets: [
        {
          label: 'Activity Level',
          data: activityData.map(item => item.activityLevel),
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.3,
        },
        {
          label: 'Social Engagement',
          data: activityData.map(item => item.socialEngagement),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.3,
        },
        {
          label: 'Emotional Stability',
          data: activityData.map(item => item.emotionalStability),
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.5)',
          tension: 0.3,
        },
      ],
    };
  }, [activityData]);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Activity & Engagement Trends',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}`;
          },
          footer: function(tooltipItems) {
            const dataIndex = tooltipItems[0].dataIndex;
            const notes = activityData[dataIndex]?.notes;
            return notes ? `Notes: ${notes}` : '';
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Score',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };

  // Detect significant changes in patterns
  const significantChanges = useMemo(() => {
    if (activityData.length < 2) return [];
    
    const changes = [];
    const thresholdChange = 15; // Significant change threshold
    
    for (let i = 1; i < activityData.length; i++) {
      const current = activityData[i];
      const previous = activityData[i-1];
      
      const activityChange = Math.abs(current.activityLevel - previous.activityLevel);
      const socialChange = Math.abs(current.socialEngagement - previous.socialEngagement);
      const emotionalChange = Math.abs(current.emotionalStability - previous.emotionalStability);
      
      if (activityChange > thresholdChange) {
        changes.push({
          date: current.date,
          metric: 'Activity Level',
          change: current.activityLevel - previous.activityLevel,
        });
      }
      
      if (socialChange > thresholdChange) {
        changes.push({
          date: current.date,
          metric: 'Social Engagement',
          change: current.socialEngagement - previous.socialEngagement,
        });
      }
      
      if (emotionalChange > thresholdChange) {
        changes.push({
          date: current.date,
          metric: 'Emotional Stability',
          change: current.emotionalStability - previous.emotionalStability,
        });
      }
    }
    
    return changes;
  }, [activityData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="h-80">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      {significantChanges.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Significant Changes Detected</h3>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <ul className="list-disc pl-5 space-y-1">
              {significantChanges.map((change, index) => (
                <li key={index} className="text-sm text-gray-700">
                  <span className="font-medium">{change.date}:</span> {change.metric} {change.change > 0 ? 'increased' : 'decreased'} by {Math.abs(change.change)} points
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityTrendsChart; 