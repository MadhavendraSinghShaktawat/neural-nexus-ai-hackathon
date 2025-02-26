import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-16 h-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform"></div>
        <div className="absolute inset-0 flex items-center justify-center text-3xl">
          <BeeIcon />
        </div>
      </div>
      <span className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        HappyBuddy
      </span>
    </div>
  );
};

const BeeIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Add your bee SVG path here */}
  </svg>
); 