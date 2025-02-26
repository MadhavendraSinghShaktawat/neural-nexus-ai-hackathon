import React from 'react';

interface RecommendationsCardProps {
  moodData: any;
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ moodData }) => {
  // Generate recommendations based on mood data
  const getRecommendations = () => {
    const recommendations = [];
    
    // Check average mood
    if (moodData.averageMood <= 4) {
      recommendations.push({
        title: "Schedule a check-in",
        description: "Your child's mood has been low. Consider scheduling a conversation to understand what might be bothering them.",
        priority: "high"
      });
    }
    
    // Check for mood swings
    if (moodData.trendData.length >= 3) {
      let hasSwings = false;
      for (let i = 1; i < moodData.trendData.length; i++) {
        if (Math.abs(moodData.trendData[i].rating - moodData.trendData[i-1].rating) >= 4) {
          hasSwings = true;
          break;
        }
      }
      
      if (hasSwings) {
        recommendations.push({
          title: "Monitor mood swings",
          description: "There appear to be significant mood fluctuations. Try to identify potential triggers.",
          priority: "medium"
        });
      }
    }
    
    // Check for common triggers
    if (moodData.topTags.length > 0) {
      const negativeEmotions = ['stressed', 'anxious', 'sad', 'angry', 'tired', 'frustrated', 'lonely'];
      const foundNegativeTags = moodData.topTags.filter(item => 
        negativeEmotions.includes(item.tag.toLowerCase())
      );
      
      if (foundNegativeTags.length > 0) {
        recommendations.push({
          title: "Address common triggers",
          description: `Your child frequently mentions feeling ${foundNegativeTags.map(t => t.tag.toLowerCase()).join(', ')}. Consider discussing these feelings.`,
          priority: "medium"
        });
      }
    }
    
    // Add general recommendations if few specific ones
    if (recommendations.length < 2) {
      recommendations.push({
        title: "Encourage regular check-ins",
        description: "Regular emotional check-ins help build trust and open communication.",
        priority: "low"
      });
      
      recommendations.push({
        title: "Promote healthy habits",
        description: "Ensure your child is getting enough sleep, exercise, and nutritious food to support emotional well-being.",
        priority: "medium"
      });
    }
    
    return recommendations;
  };

  const recommendations = getRecommendations();

  // Helper function to get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
      
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3">
              <div className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{rec.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{rec.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsCard; 