import React from 'react';

export const DecorativeElements: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 text-4xl text-primary-500/20 animate-float">+</div>
      <div className="absolute top-40 right-20 text-2xl text-secondary-500/20 animate-float-delayed">1</div>
      <div className="absolute bottom-20 left-1/4 text-3xl text-primary-500/20 animate-float-slow">A</div>
      <div className="absolute top-1/3 right-1/4 text-4xl text-secondary-500/20 animate-float-slower">2</div>
      <div className="absolute bottom-40 right-10 text-5xl text-primary-500/20 animate-gentle-bounce">×</div>
    </div>
  );
}; 