import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const languages = [
    { name: "English", code: "gb" },
    { name: "Deutsch", code: "de" },
    { name: "Français", code: "fr" },
    { name: "Español", code: "es" },
    { name: "Italiano", code: "it" },
    { name: "Português", code: "pt" },
    { name: "Nederlands", code: "nl" },
    { name: "Suomalainen", code: "fi" },
    { name: "Svenska", code: "se" },
    { name: "Čeština", code: "cz" },
    { name: "日本語", code: "jp" },
    { name: "中文 (简体)", code: "cn" },
    { name: "हिन्दी", code: "in" },
  ];

  return (
    <header className="bg-white shadow-sm fixed w-full z-20 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-blue-600 flex items-center">
            <span role="img" aria-label="talkpal-logo">
              📞
            </span>
            SpeakUp AI
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            onClick={() => navigate("/language-config")}
          >
            Get started
          </button>
          <div className="relative">
            <button
              className="flex items-center space-x-2 rounded-full px-3 py-1  transition "
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onBlur={() => setIsDropdownOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded-full overflow-hidden">
                  <span className={`fi fi-gb !w-full !h-full`}></span>
                </div>
                <span className="text-black font-semibold text-[15px]">EN</span>
              </div>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10"
              >
                {languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div className="w-5 h-5 rounded-full overflow-hidden">
                      <span
                        className={`fi fi-${lang.code} !w-full !h-full rounded-full border border-gray-300`}
                      ></span>
                    </div>

                    <span>{lang.name}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
