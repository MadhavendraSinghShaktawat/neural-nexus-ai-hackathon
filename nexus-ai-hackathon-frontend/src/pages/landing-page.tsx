import React from 'react';
import { Header } from '../components/layout/Header';
import { HeroSection } from '../components/sections/HeroSection';
import { AppsSection } from '../components/sections/AppsSection';
import { TestimonialsSection } from '../components/sections/TestimonialsSection';
import { Footer } from '../components/layout/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main>
        <HeroSection />
        <AppsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage; 