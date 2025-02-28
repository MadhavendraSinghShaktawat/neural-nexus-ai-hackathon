import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import MoodSummaryCard from '../components/dashboard/MoodSummaryCard';
import MoodTrendsChart from '../components/dashboard/MoodTrendsChart';
import EmotionDistributionChart from '../components/dashboard/EmotionDistributionChart';
import TopEmotionalTriggersCard from '../components/dashboard/TopEmotionalTriggersCard';
import RecentActivitiesCard from '../components/dashboard/RecentActivitiesCard';
import RecommendationsCard from '../components/dashboard/RecommendationsCard';
import GenerateReportModal from '../components/dashboard/GenerateReportModal';
import TherapistReportModal from '../components/dashboard/TherapistReportModal';
import HealthMonitorModal from '../components/dashboard/HealthMonitorModal';
import { UserIcon, HeartIcon } from '@heroicons/react/24/outline';
import { FaChartLine, FaCalendarAlt, FaComments, FaClipboardList, FaExclamationTriangle } from 'react-icons/fa';

// API endpoint for future use
// const API_BASE_URL = 'http://localhost:3000/api';

const ParentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [moodData, setMoodData] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showTherapistReportModal, setShowTherapistReportModal] = useState<boolean>(false);
  const [showHealthMonitorModal, setShowHealthMonitorModal] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    end: new Date()
  });
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
    fetchChatHistory();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Format dates for API - commented out since not used yet
      // const startDate = dateRange.start.toISOString().split('T')[0];
      // const endDate = dateRange.end.toISOString().split('T')[0];
      
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockData = {
        averageMood: 6.8,
        totalEntries: 24,
        highestMood: 9,
        lowestMood: 3,
        moodDistribution: [
          { rating: 1, count: 0 },
          { rating: 2, count: 0 },
          { rating: 3, count: 1 },
          { rating: 4, count: 2 },
          { rating: 5, count: 3 },
          { rating: 6, count: 5 },
          { rating: 7, count: 7 },
          { rating: 8, count: 4 },
          { rating: 9, count: 2 },
          { rating: 10, count: 0 }
        ],
        trendData: Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return {
            _id: `mood_${i}`,
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            rating: Math.floor(Math.random() * 4) + 5 // Random rating between 5-8
          };
        }),
        topTags: [
          { tag: 'School', count: 12 },
          { tag: 'Friends', count: 8 },
          { tag: 'Homework', count: 7 },
          { tag: 'Tired', count: 5 },
          { tag: 'Excited', count: 4 }
        ],
        recentMoods: Array.from({ length: 5 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            _id: `recent_${i}`,
            rating: Math.floor(Math.random() * 4) + 5, // Random rating between 5-8
            description: i % 2 === 0 
              ? 'Had a good day at school today. Made progress on my science project.'
              : 'Feeling a bit tired but overall okay. Spent time with friends after school.',
            tags: i % 2 === 0 
              ? ['School', 'Happy', 'Productive'] 
              : ['Friends', 'Tired', 'Okay'],
            createdAt: date.toISOString()
          };
        })
      };
      
      setMoodData(mockData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a response
      
      // Mock chat history data
      const mockChatHistory = [
        {
          id: 'chat1',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          messages: [
            { role: 'user', content: 'I had a fight with my best friend today.' },
            { role: 'assistant', content: 'I\'m sorry to hear that. Fighting with friends can be really tough. Do you want to talk about what happened?' },
            { role: 'user', content: 'She said I was ignoring her, but I was just busy with homework.' },
            { role: 'assistant', content: 'That sounds like a misunderstanding. Sometimes people can feel hurt when they don\'t have the full picture. Have you had a chance to explain your side to her?' }
          ]
        },
        {
          id: 'chat2',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          messages: [
            { role: 'user', content: 'I\'m feeling really anxious about my math test tomorrow.' },
            { role: 'assistant', content: 'Test anxiety is very common. Have you been studying for it?' },
            { role: 'user', content: 'Yes, but I still don\'t feel prepared enough.' },
            { role: 'assistant', content: 'It sounds like you\'re putting in the effort, which is great. Let\'s talk about some strategies that might help you feel more confident.' }
          ]
        },
        {
          id: 'chat3',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          messages: [
            { role: 'user', content: 'I feel like my parents don\'t understand me.' },
            { role: 'assistant', content: 'That can be a difficult feeling. What makes you feel misunderstood?' },
            { role: 'user', content: 'They always want me to do things their way and don\'t listen to my ideas.' },
            { role: 'assistant', content: 'It can be frustrating when you feel your voice isn\'t being heard. Have you tried having a calm conversation with them about how you feel?' }
          ]
        }
      ];
      
      setChatHistory(mockChatHistory);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  const handleDateRangeChange = (newRange: { start: Date; end: Date }) => {
    setDateRange(newRange);
  };

  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  const handleGenerateTherapistReport = () => {
    setShowTherapistReportModal(true);
  };

  const handleMonitorHealth = () => {
    setShowHealthMonitorModal(true);
  };

  return (
    <DashboardLayout 
      title="Parent Dashboard" 
      subtitle="Monitor your child's emotional well-being"
      isLoading={isLoading}
      error={error}
      onBackClick={() => navigate('/')}
      onGenerateReportClick={handleGenerateReport}
      onDateRangeChange={handleDateRangeChange}
      dateRange={dateRange}
      extraButtons={
        <div className="flex gap-2">
          <button
            onClick={handleMonitorHealth}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <HeartIcon className="w-5 h-5" />
            <span>Monitor Health</span>
          </button>
          <button
            onClick={handleGenerateTherapistReport}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <UserIcon className="w-5 h-5" />
            <span>Therapist Report</span>
          </button>
        </div>
      }
    >
      {moodData && (
        <>
          {/* Top Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <MoodSummaryCard 
              averageMood={moodData.averageMood}
              totalEntries={moodData.totalEntries}
              highestMood={moodData.highestMood}
              lowestMood={moodData.lowestMood}
            />
            <TopEmotionalTriggersCard topTags={moodData.topTags} />
            <RecommendationsCard moodData={moodData} />
          </div>
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <MoodTrendsChart trendData={moodData.trendData} />
            <EmotionDistributionChart distribution={moodData.moodDistribution} />
          </div>

          {/* Risk Analysis Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-purple-500 px-4 py-3">
            <h2 className="text-white text-lg font-semibold flex items-center">
              <FaExclamationTriangle className="mr-2" /> Risk Analysis
            </h2>
          </div>
          <div className="p-5">
            <p className="text-gray-600 mb-4">Monitor behavioral patterns and identify potential risks.</p>
            <Link 
              to="/risk-analysis" 
              className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              View Risk Analysis
            </Link>
          </div>
        </div>
          
          {/* Recent Activities */}
          <RecentActivitiesCard recentMoods={moodData.recentMoods} />
        </>
      )}
      
      {/* Generate Report Modal */}
      <GenerateReportModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        moodData={moodData}
        dateRange={dateRange}
      />

      {/* Therapist Report Modal */}
      <TherapistReportModal
        isOpen={showTherapistReportModal}
        onClose={() => setShowTherapistReportModal(false)}
        moodData={moodData}
        chatHistory={chatHistory}
        dateRange={dateRange}
      />
      
      {/* Health Monitor Modal */}
      <HealthMonitorModal
        isOpen={showHealthMonitorModal}
        onClose={() => setShowHealthMonitorModal(false)}
        dateRange={dateRange}
      />
    </DashboardLayout>
  );
};

export default ParentDashboardPage; 