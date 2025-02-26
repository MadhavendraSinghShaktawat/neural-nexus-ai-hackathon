import React from 'react';

interface TopEmotionalTriggersCardProps {
  topTags: Array<{
    tag: string;
    count: number;
  }>;
}

const TopEmotionalTriggersCard: React.FC<TopEmotionalTriggersCardProps> = ({ topTags }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Top Emotional Triggers</h2>
      
      {topTags.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-gray-500">
          No tags available for the selected period
        </div>
      ) : (
        <div className="space-y-3">
          {topTags.map((item, index) => (
            <div key={item.tag} className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mr-3">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-700">{item.tag}</span>
                  <span className="text-gray-500 text-sm">{item.count} entries</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (item.count / topTags[0].count) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopEmotionalTriggersCard; 