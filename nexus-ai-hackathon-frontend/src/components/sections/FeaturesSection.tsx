import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: "🎤",
    title: "Voice Chat AI",
    description: "Talk to HappyBuddy and share how you're feeling",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: "📊",
    title: "Mood Tracking",
    description: "Keep track of daily emotions with a simple & fun interface",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: "📝",
    title: "AI Insights & Reports",
    description: "AI-generated emotional insights to help parents & teachers",
    color: "from-green-400 to-cyan-500",
  },
  {
    icon: "💙",
    title: "Personalized Guidance",
    description: "Get positive encouragement and support based on mood trends",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: "🔔",
    title: "Stress & Well-Being Alerts",
    description: "AI detects prolonged stress and provides calming suggestions",
    color: "from-pink-400 to-rose-500",
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Empowering Kids with{" "}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              AI-Powered Emotional Support!
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Help your children develop emotional intelligence and resilience with our innovative features
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
              
              {/* Interactive Element */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <button className="text-primary-500 hover:text-primary-600 font-medium flex items-center gap-2 group">
                  Learn more
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI technology is designed to be child-friendly and safe, helping kids express themselves 
            while providing valuable insights to parents and educators.
          </p>
          <button className="mt-8 px-8 py-3 bg-white text-primary-500 font-semibold rounded-full border-2 border-primary-500 hover:bg-primary-50 transition-colors">
            View All Features
          </button>
        </motion.div>
      </div>
    </section>
  );
}; 