import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, PlusIcon, XMarkIcon, TagIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

// Define mood levels and their properties
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

// Suggested mood tags
const SUGGESTED_TAGS = [
  'Happy', 'Sad', 'Anxious', 'Calm', 'Tired', 'Energetic', 
  'Stressed', 'Relaxed', 'Angry', 'Grateful', 'Excited', 
  'Bored', 'Hopeful', 'Confused', 'Proud', 'Lonely', 'Loved',
  'Motivated', 'Dizzy', 'Focused', 'Creative', 'Frustrated'
];

// API endpoint
const API_BASE_URL = 'http://localhost:3000/api';

interface MoodEntry {
  _id: string;
  userId: string;
  rating: number;
  description: string;
  tags: string[];
  createdAt: string;
  __v?: number;
}

const MoodTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const [moodRating, setMoodRating] = useState<number>(7);
  const [description, setDescription] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showTagInput, setShowTagInput] = useState<boolean>(false);
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const circularSliderRef = useRef<HTMLDivElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Fetch recent moods on component mount
  useEffect(() => {
    fetchRecentMoods();
  }, []);

  // Focus tag input when shown
  useEffect(() => {
    if (showTagInput && tagInputRef.current) {
      tagInputRef.current.focus();
    }
  }, [showTagInput]);

  const fetchRecentMoods = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/moods`);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.data && Array.isArray(data.data.moods)) {
        setRecentMoods(data.data.moods);
      } else {
        console.error('Unexpected API response format:', data);
        setRecentMoods([]);
        setError('Received invalid data format from the server.');
      }
    } catch (error) {
      console.error('Error fetching moods:', error);
      setError('Failed to load your mood history. Please try again later.');
      setRecentMoods([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCircularSliderChange = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!circularSliderRef.current) return;
    
    // Get the center of the circular slider
    const rect = circularSliderRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Get the position of the click/touch
    let clientX, clientY;
    if ('touches' in event) {
      // Touch event
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      // Mouse event
      clientX = event.clientX;
      clientY = event.clientY;
    }
    
    // Calculate the angle
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Convert angle to 0-360 range
    if (angle < 0) {
      angle += 360;
    }
    
    // Map angle to mood rating (1-10)
    // 0 degrees (right) = 10, going counter-clockwise
    const normalizedAngle = (angle + 90) % 360;
    const rating = Math.ceil((normalizedAngle / 36) % 10) || 10;
    
    setMoodRating(rating);
  };

  const handleAddTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setCustomTag('');
    setShowTagInput(false);
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleCustomTagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTag.trim()) {
      handleAddTag(customTag.trim());
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const moodData = {
        rating: moodRating,
        description: description.trim(),
        tags: selectedTags
      };
      
      const response = await fetch(`${API_BASE_URL}/moods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moodData),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      // Reset form
      setDescription('');
      setSelectedTags([]);
      
      // Refresh mood history
      await fetchRecentMoods();
      
      // Show success message or redirect
      // For now, we'll just log success
      console.log('Mood saved successfully!');
      
    } catch (error) {
      console.error('Error saving mood:', error);
      setError('Failed to save your mood. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodColor = (rating: number) => {
    return MOOD_LEVELS.find(level => level.value === rating)?.color || '#3182ce';
  };

  const getMoodLabel = (rating: number) => {
    return MOOD_LEVELS.find(level => level.value === rating)?.label || 'Good';
  };

  const getMoodEmoji = (rating: number) => {
    return MOOD_LEVELS.find(level => level.value === rating)?.emoji || '😊';
  };

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
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-800">Mood Tracker</h1>
              <p className="text-sm text-gray-500">Track how you're feeling</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/mood-history')}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                View History
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-24 pb-32">
        <div className="max-w-3xl mx-auto">
          {/* Mood Selector */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-center mb-8">How are you feeling today?</h2>
            
            {/* Circular Mood Slider */}
            <div className="relative w-64 h-64 mx-auto mb-8">
              {/* Circular track */}
              <div 
                ref={circularSliderRef}
                className="absolute inset-0 rounded-full border-8 border-gray-100"
                onMouseDown={handleCircularSliderChange}
                onMouseMove={(e) => e.buttons === 1 && handleCircularSliderChange(e)}
                onTouchStart={handleCircularSliderChange}
                onTouchMove={handleCircularSliderChange}
              >
                {/* Mood level indicators */}
                {MOOD_LEVELS.map((level) => {
                  const angle = ((level.value - 1) * 36) - 90;
                  const radians = angle * (Math.PI / 180);
                  const radius = 100;
                  const x = radius * Math.cos(radians);
                  const y = radius * Math.sin(radians);
                  
                  return (
                    <div 
                      key={level.value}
                      className={classNames(
                        "absolute w-6 h-6 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2",
                        moodRating === level.value ? "scale-125 z-10" : ""
                      )}
                      style={{ 
                        left: `calc(50% + ${x}px)`, 
                        top: `calc(50% + ${y}px)`,
                        backgroundColor: level.color,
                        opacity: moodRating === level.value ? 1 : 0.5,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span className="text-xs text-white font-bold">{level.value}</span>
                    </div>
                  );
                })}
                
                {/* Selected mood indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-32 h-32 rounded-full flex flex-col items-center justify-center transition-colors"
                    style={{ backgroundColor: getMoodColor(moodRating) }}
                  >
                    <span className="text-4xl mb-1">{getMoodEmoji(moodRating)}</span>
                    <span className="text-white font-semibold">{getMoodLabel(moodRating)}</span>
                    <span className="text-white/80 text-sm">{moodRating}/10</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mood Description */}
            <div className="mb-6">
              <label htmlFor="mood-description" className="block text-sm font-medium text-gray-700 mb-2">
                What's on your mind? (optional)
              </label>
              <textarea
                id="mood-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe how you're feeling..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none h-24"
              />
            </div>
            
            {/* Mood Tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add tags (optional)
              </label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.map(tag => (
                  <div 
                    key={tag} 
                    className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    <span>{tag}</span>
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="w-4 h-4 rounded-full bg-primary-200 text-primary-800 flex items-center justify-center hover:bg-primary-300"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                
                {!showTagInput && (
                  <button
                    onClick={() => setShowTagInput(true)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Tag</span>
                  </button>
                )}
              </div>
              
              {/* Tag Input */}
              <AnimatePresence>
                {showTagInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <form onSubmit={handleCustomTagSubmit} className="mb-3">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            ref={tagInputRef}
                            type="text"
                            value={customTag}
                            onChange={(e) => setCustomTag(e.target.value)}
                            placeholder="Enter a tag..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowTagInput(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-2">Suggested tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {SUGGESTED_TAGS.filter(tag => !selectedTags.includes(tag)).slice(0, 10).map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleAddTag(tag)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={classNames(
                "w-full py-3 rounded-xl text-white font-semibold transition-all",
                "bg-primary-500 hover:bg-primary-600 focus:ring-2 focus:ring-primary-500/20",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isSubmitting ? 'Saving...' : 'Save Mood Entry'}
            </button>
          </div>
          
          {/* Recent Moods */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Mood Entries</h2>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={fetchRecentMoods}
                  className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : recentMoods.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No mood entries yet. Start tracking your mood today!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentMoods.map((mood) => (
                  <div key={mood._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: getMoodColor(mood.rating) }}
                      >
                        <span className="text-2xl">{getMoodEmoji(mood.rating)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{getMoodLabel(mood.rating)} ({mood.rating}/10)</h3>
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
        </div>
      </div>
    </div>
  );
};

export default MoodTrackerPage; 