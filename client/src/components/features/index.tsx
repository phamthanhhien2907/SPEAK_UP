import { motion } from "framer-motion";
import * as React from "react";

const features = [
  {
    icon: "📚",
    title: "Personalized Learning",
    desc: "Tailored lessons to match your level and goals.",
  },
  {
    icon: "💬",
    title: "Interactive Conversations",
    desc: "Practice speaking with AI in real-time.",
  },
  {
    icon: "✅",
    title: "Instant Feedback",
    desc: "Get immediate corrections to improve faster.",
  },
  {
    icon: "🌍",
    title: "Cultural Insights",
    desc: "Learn cultural nuances alongside the language.",
  },
];

export const Features: React.FC = () => (
  <section className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
      >
        Why SpeakUp AI?
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
