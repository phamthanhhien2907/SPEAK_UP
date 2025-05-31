import { motion } from "framer-motion";
import * as React from "react";

const languages = [
  { name: "English", code: "gb" },
  { name: "Spanish", code: "es" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
  { name: "Italian", code: "it" },
  { name: "Portuguese", code: "pt" },
  { name: "Japanese", code: "jp" },
  { name: "Chinese", code: "cn" },
  { name: "Arabic", code: "ae" },
  { name: "Dutch", code: "nl" },
  { name: "Korean", code: "kr" },
  { name: "Swedish", code: "se" },
  { name: "Norwegian", code: "no" },
  { name: "Finnish", code: "fi" },
  { name: "Greek", code: "gr" },
];

export const LanguageSelection: React.FC = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="py-20 bg-white text-center"
  >
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-50 text-center py-2 text-blue-600 font-medium"
    >
      57+ Languages
    </motion.div>
    <h2 className="text-3xl md:text-3xl font-bold text-gray-900 mb-8">
      WHICH LANGUAGE DO YOU WANT TO LEARN?
    </h2>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-6">
        {languages.map((lang, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex flex-col items-center p-4 gap-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <span
                className={`fi fi-${lang.code} !w-full !h-full rounded-full`}
              ></span>
            </div>

            <span className="line-clamp-1 whitespace-normal break-words text-center text-base font-medium text-[#676768] --webkit-line-clamp-1">
              {lang.name}
            </span>
          </motion.div>
        ))}
        <div className="flex items-center justify-center p-4">
          <button className="text-blue-600 font-medium">+42 MORE</button>
        </div>
      </div>
    </div>
  </motion.section>
);

export default LanguageSelection;
