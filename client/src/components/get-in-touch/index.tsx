import { motion } from "framer-motion";
import * as React from "react";

const GetInTouch: React.FC = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="py-16 bg-gray-50 text-center"
  >
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      GET IN TOUCH WITH US
    </h2>
    <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
      Talkpal is a GPT-powered AI language teacher. Boost your speaking,
      listening, writing, and pronunciation skills - Learn 5x Faster!
    </p>
    <div className="flex justify-center space-x-4 mb-8">
      <a href="#" className="text-2xl">
        <span role="img" aria-label="instagram">
          📸
        </span>
      </a>
      <a href="#" className="text-2xl">
        <span role="img" aria-label="spotify">
          🎵
        </span>
      </a>
      <a href="#" className="text-2xl">
        <span role="img" aria-label="youtube">
          🎥
        </span>
      </a>
      <a href="#" className="text-2xl">
        <span role="img" aria-label="facebook">
          👍
        </span>
      </a>
      <a href="#" className="text-2xl">
        <span role="img" aria-label="linkedin">
          💼
        </span>
      </a>
      <a href="#" className="text-2xl">
        <span role="img" aria-label="twitter">
          🐦
        </span>
      </a>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
        <ul className="text-gray-600 space-y-2">
          <li>Learn English</li>
          <li>Learn Spanish</li>
          <li>Learn French</li>
          <li>Learn Italian</li>
          <li>Learn German</li>
          <li>Learn Ukrainian</li>
          <li>Learn Dutch</li>
          <li>Learn Swedish</li>
          <li>Learn Finnish</li>
          <li>Learn Arabic</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning</h3>
        <ul className="text-gray-600 space-y-2">
          <li>Grammar</li>
          <li>Roleplays</li>
          <li>Characters</li>
          <li>Debates</li>
          <li>Phrases</li>
          <li>Call Mode</li>
          <li>Sentence Mode</li>
          <li>AI Learning Insights</li>
          <li>Language Certificates</li>
          <li>Video Lessons</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Partnerships
        </h3>
        <ul className="text-gray-600 space-y-2">
          <li>Talkpal for Education</li>
          <li>Talkpal for Business</li>
          <li>Talkpal Affiliate</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
        <ul className="text-gray-600 space-y-2">
          <li>About</li>
          <li>Blog</li>
          <li>Press</li>
          <li>Pricing</li>
          <li>Contact</li>
          <li>Help Center</li>
          <li>Privacy Policy</li>
          <li>Terms and Conditions</li>
          <li>End User License Agreement</li>
        </ul>
      </div>
    </div>
  </motion.section>
);

export default GetInTouch;
