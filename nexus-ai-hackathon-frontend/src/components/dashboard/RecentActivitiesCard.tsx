import React from 'react';

interface RecentActivitiesCardProps {
  recentMoods: Array<{
    _id: string;
    rating: number;
    description: string;
    tags: string[];
    createdAt: string;
  }>;
}

const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({ recentMoods }) => {
  // Helper function to get mood emoji
  const getMoodEmoji = (rating: number) => {
    if (rating <= 2) return '😢';
    if (rating <= 4) return '😕';
    if (rating <= 6) return '😐';
    if (rating <= 8) return '😊';
    return '😁';
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
      
      {recentMoods.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No recent mood entries available
        </div>
      ) : (
        <div className="space-y-4">
          {recentMoods.map((mood) => (
            <div key={mood._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{getMoodEmoji(mood.rating)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Mood Rating: {mood.rating}/10</h3>
                      {mood.description && (
                        <p className="text-gray-600 text-sm mt-1">{mood.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(mood.createdAt)}</span>
                  </div>
                  {mood.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {mood.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivitiesCard; 