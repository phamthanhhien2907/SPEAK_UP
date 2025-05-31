import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as React from "react";
import beginer from "@/assets/user/beginer.svg";
import intermediate from "@/assets/user/intermediate.svg";
import advanced from "@/assets/user/advanced.svg";
import { MdKeyboardArrowLeft } from "react-icons/md";

const LanguageLevel: React.FC = () => {
  const { state } = useLocation();
  const { selectedLanguage } = state || { selectedLanguage: "Unknown" };
  const navigate = useNavigate();

  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const levels = [
    {
      name: "Beginner",
      description: "I'm just starting out.",
      level: "A1-A2",
      image: beginer,
    },
    {
      name: "Intermediate",
      description: "I know the basics.",
      level: "B1-B2",
      image: intermediate,
    },
    {
      name: "Advanced",
      description: "I'm fluent or nearly fluent.",
      level: "C1-C2",
      image: advanced,
    },
  ];

  const handleLevelSelect = (level: string) => {
    setSelectedLevel(level);
  };

  const handleContinue = () => {
    if (selectedLevel) {
      console.log(
        `Selected language: ${selectedLanguage}, Level: ${selectedLevel}`
      );
      // Navigate to the next page or perform an action
      // For now, we'll just log the selection
      navigate("/auth"); // Replace with your desired route
    }
  };

  return (
    <div className="min-h-screen bg-blue-700">
      <div className="flex justify-between items-center w-full px-6 py-4">
        <span className="text-2xl font-bold">🤖</span>
        <button className="bg-white text-blue-600 px-6 py-1 rounded-full transition">
          <span className="text-blue-500 text-xs font-semibold">English</span>
        </button>
      </div>
      <div className="flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-[700px]">
          <div className="flex items-center pb-4">
            <MdKeyboardArrowLeft
              size={37}
              color="black"
              className="text-gray-700 cursor-pointer hover:text-gray-900"
              onClick={() => navigate(-1)}
            />
            <h2 className="text-xl font-semibold text-gray-900">
              What’s your level in {selectedLanguage}?
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {levels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex flex-col p-4 rounded-lg border cursor-pointer transition ${
                  selectedLevel === level.name
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300"
                } hover:bg-gray-50`}
                onClick={() => handleLevelSelect(level.name)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={level?.image} alt={level.name} className="" />
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-medium text-gray-900">
                        {level.name}
                        <span className="text-sm text-gray-500 px-1">
                          ({level.description})
                        </span>
                      </span>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">
                    {level?.level}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <button
            className="w-full bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition disabled:bg-blue-400 rounded-xl"
            onClick={handleContinue}
            disabled={!selectedLevel}
          >
            Continue
          </button>
          <p className="text-center text-sm text-gray-500 mt-4 font-medium">
            Already a member?{" "}
            <a
              href="#"
              className="text-blue-600 underline text-base font-medium px-1"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageLevel;
