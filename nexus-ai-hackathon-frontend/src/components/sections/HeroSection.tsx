import React from 'react';
import { motion } from 'framer-motion';
import { BeeIcon } from '../ui/Icons';
import { DecorativeElements } from '../ui/DecorativeElements';
import { useNavigate } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleStartSession = () => {
    navigate('/chat');
  };
  
  const handleStartVideoChat = () => {
    navigate('/video-chat');
  };

  return (
    <section className="pt-20 md:pt-32 pb-16 relative overflow-hidden" id="home">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 md:space-y-8 text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Your AI Friend for a
              <span className="block mt-2 bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Happier Mind!
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
              Talk, track, and grow! HappyBuddy helps kids express their emotions, track their moods, 
              and feel better every day with AI-powered support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={handleStartSession}
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-primary-500 text-white font-semibold rounded-full hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                Start Session
              </button>
              <button 
                onClick={handleStartVideoChat}
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-purple-500 text-white font-semibold rounded-full hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Video Chat
              </button>
              <button 
                onClick={() => navigate('/mood-tracker')}
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-yellow-400 text-gray-800 font-semibold rounded-full hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-400/30 transition-all"
              >
                Mood Tracker
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="absolute -top-20 -right-20 w-48 md:w-72 h-48 md:h-72 bg-primary-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-48 md:w-72 h-48 md:h-72 bg-secondary-500/20 rounded-full blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 shadow-2xl mx-auto max-w-md lg:max-w-none">
              <div className="absolute -top-8 md:-top-12 -left-8 md:-left-12 animate-bounce hidden sm:block">
                <BeeIcon size={60} />
              </div>
              <div className="relative rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-lg">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary-500/10 to-secondary-500/10 p-4 md:p-6">
                  <img
                    src="./public/model.webp"
                    alt="HappyBuddy App Interface"
                    className="w-full h-full object-cover rounded-lg md:rounded-xl shadow-lg"
                  />
                </div>
                <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-xl md:text-2xl">😊</span>
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-primary-200 rounded-full w-3/4"></div>
                      <div className="h-2 bg-gray-100 rounded-full w-1/2 mt-2"></div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm whitespace-nowrap">
                      Happy
                    </span>
                    <span className="px-3 py-1 bg-secondary-100 text-secondary-600 rounded-full text-sm whitespace-nowrap">
                      Excited
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <DecorativeElements />
    </section>
  );
}; 