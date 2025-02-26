import React from 'react';

interface MoodSummaryCardProps {
  averageMood: number;
  totalEntries: number;
  highestMood: number;
  lowestMood: number;
}

const MoodSummaryCard: React.FC<MoodSummaryCardProps> = ({
  averageMood,
  totalEntries,
  highestMood,
  lowestMood
}) => {
  // Helper function to get mood label
  const getMoodLabel = (rating: number) => {
    if (rating <= 2) return 'Poor';
    if (rating <= 4) return 'Below Average';
    if (rating <= 6) return 'Average';
    if (rating <= 8) return 'Good';
    return 'Excellent';
  };

  // Helper function to get mood color
  const getMoodColor = (rating: number) => {
    if (rating <= 2) return 'bg-red-500';
    if (rating <= 4) return 'bg-orange-500';
    if (rating <= 6) return 'bg-yellow-500';
    if (rating <= 8) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Mood Summary</h2>
      
      <div className="flex flex-col items-center mb-4">
        <div className={`w-20 h-20 rounded-full ${getMoodColor(averageMood)} flex items-center justify-center mb-2`}>
          <span className="text-2xl text-white font-bold">{averageMood}</span>
        </div>
        <p className="text-gray-700 font-medium">Average Mood: {getMoodLabel(averageMood)}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Entries</p>
          <p className="text-xl font-semibold">{totalEntries}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Highest</p>
          <p className="text-xl font-semibold">{highestMood}/10</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Lowest</p>
          <p className="text-xl font-semibold">{lowestMood}/10</p>
        </div>
      </div>
    </div>
  );
};

export default MoodSummaryCard; 