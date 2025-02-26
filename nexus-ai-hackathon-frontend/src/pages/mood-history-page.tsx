import React, { useState, useEffect, useMemo } from 'react';
import { motion} from 'framer-motion';
import { ArrowLeftIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import classNames from 'classnames';

// API endpoint
const API_BASE_URL = 'http://localhost:3000/api';

// Define mood levels and their properties (same as in mood-tracker-page.tsx)
const MOOD_LEVELS = [
  { value: 1, color: '#e53e3e', label: 'Terrible', emoji: '😭' },
  { value: 2, color: '#dd6b20', label: 'Bad', emoji: '😢' },
  { value: 3, color: '#d69e2e', label: 'Poor', emoji: '😞' },
  { value: 4, color: '#b7791f', label: 'Meh', emoji: '😕' },
  { value: 5, color: '#38a169', label: 'Okay', emoji: '😐' },
  { value: 6, color: '#319795', label: 'Fine', emoji: '🙂' },
  { value: 7, color: '#3182ce', label: 'Good', emoji: '😊' },
  { value: 8, color: '#5a67d8', label: 'Great', emoji: '😄' },
  { value: 9, color: '#805ad5', label: 'Amazing', emoji: '😁' },
  { value: 10, color: '#d53f8c', label: 'Excellent', emoji: '🤩' },
];

interface MoodEntry {
  _id: string;
  userId: string;
  rating: number;
  description: string;
  tags: string[];
  createdAt: string;
}

interface MoodResponse {
  status: string;
  data: {
    moods: MoodEntry[];
    total: number;
    page: number;
    totalPages: number;
  };
}

type ViewMode = 'calendar' | 'graph';
type GraphType = 'line' | 'bar';
type TimeRange = 'week' | 'month' | 'year' | 'all';

const MoodHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [graphType, setGraphType] = useState<GraphType>('line');
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMood, setSelectedMood] = useState<MoodEntry | null>(null);

  // Fetch mood data
  useEffect(() => {
    fetchMoods();
  }, [timeRange]);

  const fetchMoods = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/moods`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data: MoodResponse = await response.json();
      setMoods(data.data.moods);
    } catch (error) {
      console.error('Error fetching moods:', error);
      setError('Failed to load your mood history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Process mood data for calendar view
  const calendarData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // Get the first day of the current month
    const firstDay = new Date(year, month, 1);
    // Get the last day of the current month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    // Create an array of days for the calendar
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: null, mood: null });
    }
    
    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      
      // Find mood entries for this day
      const dayMoods = moods.filter(mood => {
        const moodDate = new Date(mood.createdAt).toISOString().split('T')[0];
        return moodDate === dateString;
      });
      
      // Use the average mood if there are multiple entries for the day
      let averageMood = null;
      if (dayMoods.length > 0) {
        const sum = dayMoods.reduce((acc, mood) => acc + mood.rating, 0);
        averageMood = Math.round(sum / dayMoods.length);
      }
      
      days.push({ 
        date, 
        mood: averageMood,
        entries: dayMoods
      });
    }
    
    return days;
  }, [moods]);

  // Process mood data for graph view
  const graphData = useMemo(() => {
    if (!moods.length) return [];
    
    // Sort moods by date
    const sortedMoods = [...moods].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    // Filter based on time range
    const now = new Date();
    let filteredMoods = sortedMoods;
    
    if (timeRange === 'week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredMoods = sortedMoods.filter(mood => 
        new Date(mood.createdAt) >= oneWeekAgo
      );
    } else if (timeRange === 'month') {
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      filteredMoods = sortedMoods.filter(mood => 
        new Date(mood.createdAt) >= oneMonthAgo
      );
    } else if (timeRange === 'year') {
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      filteredMoods = sortedMoods.filter(mood => 
        new Date(mood.createdAt) >= oneYearAgo
      );
    }
    
    // Format data for charts
    return filteredMoods.map(mood => ({
      date: new Date(mood.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      rating: mood.rating,
      timestamp: new Date(mood.createdAt).getTime(),
      description: mood.description,
      tags: mood.tags,
      _id: mood._id
    }));
  }, [moods, timeRange]);

  // Get mood color
  const getMoodColor = (rating: number | null) => {
    if (rating === null) return '#e2e8f0';
    return MOOD_LEVELS.find(level => level.value === rating)?.color || '#3182ce';
  };

  // Get mood emoji
  const getMoodEmoji = (rating: number | null) => {
    if (rating === null) return '';
    return MOOD_LEVELS.find(level => level.value === rating)?.emoji || '😊';
  };

  // Handle day click in calendar view
  const handleDayClick = (day: any) => {
    if (!day.date) return;
    
    setSelectedDate(day.date);
    
    if (day.entries && day.entries.length > 0) {
      // If there are multiple entries, show the most recent one
      setSelectedMood(day.entries[0]);
    } else {
      setSelectedMood(null);
    }
  };

  // Handle point click in graph view
  const handlePointClick = (data: any) => {
    if (!data || !data.activePayload || !data.activePayload[0]) return;
    
    const clickedPoint = data.activePayload[0].payload;
    const mood = moods.find(m => m._id === clickedPoint._id);
    
    if (mood) {
      setSelectedMood(mood);
      setSelectedDate(new Date(mood.createdAt));
    }
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="font-semibold">{data.date}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg">{getMoodEmoji(data.rating)}</span>
            <span>Rating: {data.rating}/10</span>
          </div>
          {data.description && (
            <p className="text-sm text-gray-600 mt-1">{data.description}</p>
          )}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {data.tags.map((tag: string) => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/mood-tracker')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-800">Mood History</h1>
              <p className="text-sm text-gray-500">Track your emotional journey</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-24 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* View Toggle */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={classNames(
                    "px-4 py-2 flex items-center gap-2",
                    viewMode === 'calendar' 
                      ? "bg-primary-500 text-white" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <CalendarIcon className="w-5 h-5" />
                  <span>Calendar</span>
                </button>
                <button
                  onClick={() => setViewMode('graph')}
                  className={classNames(
                    "px-4 py-2 flex items-center gap-2",
                    viewMode === 'graph' 
                      ? "bg-primary-500 text-white" 
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <ChartBarIcon className="w-5 h-5" />
                  <span>Graph</span>
                </button>
              </div>

              {viewMode === 'graph' && (
                <>
                  <div className="flex rounded-lg overflow-hidden border border-gray-200">
                    <button
                      onClick={() => setGraphType('line')}
                      className={classNames(
                        "px-4 py-2",
                        graphType === 'line' 
                          ? "bg-primary-500 text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      Line
                    </button>
                    <button
                      onClick={() => setGraphType('bar')}
                      className={classNames(
                        "px-4 py-2",
                        graphType === 'bar' 
                          ? "bg-primary-500 text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      Bar
                    </button>
                  </div>

                  <div className="flex rounded-lg overflow-hidden border border-gray-200">
                    <button
                      onClick={() => setTimeRange('week')}
                      className={classNames(
                        "px-3 py-2 text-sm",
                        timeRange === 'week' 
                          ? "bg-primary-500 text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setTimeRange('month')}
                      className={classNames(
                        "px-3 py-2 text-sm",
                        timeRange === 'month' 
                          ? "bg-primary-500 text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      Month
                    </button>
                    <button
                      onClick={() => setTimeRange('year')}
                      className={classNames(
                        "px-3 py-2 text-sm",
                        timeRange === 'year' 
                          ? "bg-primary-500 text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      Year
                    </button>
                    <button
                      onClick={() => setTimeRange('all')}
                      className={classNames(
                        "px-3 py-2 text-sm",
                        timeRange === 'all' 
                          ? "bg-primary-500 text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      All
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchMoods}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Data State */}
          {!isLoading && !error && moods.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No mood data available yet.</p>
              <button
                onClick={() => navigate('/mood-tracker')}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Track Your Mood
              </button>
            </div>
          )}

          {/* Calendar View */}
          {!isLoading && !error && moods.length > 0 && viewMode === 'calendar' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {/* Day Labels */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 mb-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {calendarData.map((day, index) => (
                  <div 
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={classNames(
                      "aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all",
                      day.date ? "hover:shadow-md" : "",
                      selectedDate && day.date && 
                      selectedDate.toDateString() === day.date.toDateString() 
                        ? "ring-2 ring-primary-500" 
                        : ""
                    )}
                    style={{ 
                      backgroundColor: day.mood ? getMoodColor(day.mood) : '#f9fafb',
                      opacity: day.date ? 1 : 0.3
                    }}
                  >
                    {day.date && (
                      <>
                        <span className={classNames(
                          "text-sm font-medium",
                          day.mood ? "text-white" : "text-gray-700"
                        )}>
                          {day.date.getDate()}
                        </span>
                        {day.mood && (
                          <span className="text-lg mt-1">{getMoodEmoji(day.mood)}</span>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Selected Day Details */}
              {selectedDate && (
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-medium mb-4">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </h3>
                  
                  {selectedMood ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: getMoodColor(selectedMood.rating) }}
                        >
                          <span className="text-xl text-white">{getMoodEmoji(selectedMood.rating)}</span>
                        </div>
                        <div>
                          <p className="font-medium">
                            {MOOD_LEVELS.find(level => level.value === selectedMood.rating)?.label} ({selectedMood.rating}/10)
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(selectedMood.createdAt).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                      
                      {selectedMood.description && (
                        <p className="text-gray-700 mb-3">{selectedMood.description}</p>
                      )}
                      
                      {selectedMood.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {selectedMood.tags.map(tag => (
                            <span key={tag} className="bg-white text-gray-600 px-2 py-0.5 rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No mood recorded for this day.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Graph View */}
          {!isLoading && !error && moods.length > 0 && viewMode === 'graph' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">
                Mood Trends - {timeRange === 'week' ? 'Past Week' : 
                              timeRange === 'month' ? 'Past Month' : 
                              timeRange === 'year' ? 'Past Year' : 'All Time'}
              </h2>
              
              {/* Graph */}
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  {graphType === 'line' ? (
                    <LineChart
                      data={graphData}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      onClick={handlePointClick}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis 
                        domain={[0, 10]} 
                        ticks={[0, 2, 4, 6, 8, 10]}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="rating"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 8, fill: '#6d28d9', strokeWidth: 2, stroke: '#fff' }}
                      />
                    </LineChart>
                  ) : (
                    <BarChart
                      data={graphData}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                      onClick={handlePointClick}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <YAxis 
                        domain={[0, 10]} 
                        ticks={[0, 2, 4, 6, 8, 10]}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar
                        dataKey="rating"
                        fill="#8b5cf6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
              
              {/* Selected Mood Details */}
              {selectedMood && (
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-medium mb-4">
                    {new Date(selectedMood.createdAt).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: getMoodColor(selectedMood.rating) }}
                      >
                        <span className="text-xl text-white">{getMoodEmoji(selectedMood.rating)}</span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {MOOD_LEVELS.find(level => level.value === selectedMood.rating)?.label} ({selectedMood.rating}/10)
                        </p>
                      </div>
                    </div>
                    
                    {selectedMood.description && (
                      <p className="text-gray-700 mb-3">{selectedMood.description}</p>
                    )}
                    
                    {selectedMood.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedMood.tags.map(tag => (
                          <span key={tag} className="bg-white text-gray-600 px-2 py-0.5 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/mood-tracker')}
              className="px-6 py-3 bg-primary-500 text-white font-medium rounded-full hover:bg-primary-600 transition-colors"
            >
              Add New Mood Entry
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MoodHistoryPage; 