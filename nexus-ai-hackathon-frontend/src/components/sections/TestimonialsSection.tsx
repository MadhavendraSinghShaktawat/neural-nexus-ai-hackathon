import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Parent",
    comment: "My kids love learning with HappyBuddy! It's made education fun for them.",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDmNMLztpvMjXLqxiupAzsDmDsJWW6XdY1AA&s",
  },
  {
    name: "Michael Chen",
    role: "Teacher",
    comment: "The progress tracking features help me understand my students' development.",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkZUUzPWexwYFKYLr3eR81HIW6UGWZcAKoSQ&s",
  },
  {
    name: "Emily Williams",
    role: "Education Specialist",
    comment: "Best educational app we've tried. The games are both fun and educational.",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCXMkhlEBEnBlabBSIthNS7AeMGd6ry1vQtg&s",
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-secondary-50" id="testimonials">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">What People Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from parents and educators who've experienced the magic of our learning platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-6 rounded-3xl shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.comment}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}; 