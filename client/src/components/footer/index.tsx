import { motion } from "framer-motion";
import * as React from "react";

export const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-white">TalkPal AI</h3>
          <p className="text-gray-400 text-sm">
            Learn languages faster with AI-powered tools.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-white">Links</h3>
          <a
            href="#"
            className="block text-gray-400 hover:text-white text-sm mb-2"
          >
            Home
          </a>
          <a
            href="#"
            className="block text-gray-400 hover:text-white text-sm mb-2"
          >
            Features
          </a>
          <a
            href="#"
            className="block text-gray-400 hover:text-white text-sm mb-2"
          >
            Pricing
          </a>
          <a
            href="#"
            className="block text-gray-400 hover:text-white text-sm mb-2"
          >
            Blog
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
          <a
            href="#"
            className="block text-gray-400 hover:text-white text-sm mb-2"
          >
            Contact Us
          </a>
          <a
            href="#"
            className="block text-gray-400 hover:text-white text-sm mb-2"
          >
            FAQ
          </a>
          <a
            href="#"
            className="block text-gray-400 hover:text-white text-sm mb-2"
          >
            Terms
          </a>
          <a
            href="#"
            className="block text-gray-400 hover:text-white text-sm mb-2"
          >
            Privacy
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              🐦
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              📘
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-xl">
              📸
            </a>
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-8 text-center text-gray-400 text-sm"
      >
        © 2025 TalkPal AI. All rights reserved.
      </motion.div>
    </div>
  </footer>
);

export default Footer;
