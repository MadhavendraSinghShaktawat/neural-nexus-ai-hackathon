import React from 'react';
import { motion } from 'framer-motion';

const apps = [
  {
    title: "HappyBuddy Kids",
    description: "AI-powered emotional support and mood tracking for children",
    image: "https://www.ansaripediatrics.com/wp-content/uploads/2020/09/happy_children_0.jpg",
    color: "from-purple-500 to-pink-500",
    icon: "🌈",
  },
  {
    title: "HappyBuddy Parent",
    description: "Monitor your child's emotional well-being and get AI insights",
    image: "https://momentum-chiro.com/wp-content/uploads/2019/07/116422808_m-1350x900.jpg",
    color: "from-yellow-400 to-orange-500",
    icon: "💝",
  },
  {
    title: "HappyBuddy EDU",
    description: "Emotional intelligence tools for schools and educators",
    image: "https://preprimaryschools.com/assets/uploads/school/home/18072022024133_921479_Happy-Kids-Nursery-School-and-Day-Care-Kothrud-Pune-(8).jpg",
    color: "from-sky-400 to-blue-500",
    icon: "📚",
  },
];

export const AppsSection: React.FC = () => {
  return (
    <section className="py-20" id="apps">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Our Apps</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our collection of apps designed to support emotional well-being and mental health
          </p>
        </motion.div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apps.map((app, index) => (
            <motion.div
              key={app.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative"
            >
              {/* Card */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                {/* App Preview Image */}
                <div className={`h-48 bg-gradient-to-r ${app.color} p-6 relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                    {app.icon}
                  </div>
                  <img
                    src={app.image}
                    alt={`${app.title} Preview`}
                    className="w-full h-full object-cover rounded-xl shadow-lg"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{app.title}</h3>
                  <p className="text-gray-600 mb-4">{app.description}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm font-medium transition-colors">
                      Learn More
                    </button>
                    <button className={`flex-1 py-2 px-4 text-white rounded-full text-sm font-medium bg-gradient-to-r ${app.color} hover:shadow-lg transition-shadow`}>
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 