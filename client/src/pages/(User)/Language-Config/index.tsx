import "flag-icons/css/flag-icons.min.css";
import * as React from "react";
import "./index.css";
import "flag-icons/css/flag-icons.min.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
const LanguageConfig: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = React.useState<string | null>(
    null
  );
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<string>(""); // State riêng cho giá trị hiển thị trong input
  const navigate = useNavigate();
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
    { name: "Greek", code: "gr" },
    { name: "Hebrew", code: "il" },
    { name: "Finnish", code: "fi" },
  ];

  // Lọc danh sách ngôn ngữ dựa trên từ khóa tìm kiếm
  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredLanguages);
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setInputValue(language);
    setSearchTerm("");
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      navigate("/language-level", { state: { selectedLanguage } });
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchTerm(value);
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
              Which language do you want to learn?
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 gap-6 mb-6 max-h-96 overflow-y-auto">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex flex-col items-center p-4 gap-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer  ${
                    selectedLanguage === lang.name
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300"
                  } hover:bg-gray-50 transition`}
                  onClick={() => handleLanguageSelect(lang.name)}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <span
                      className={`fi fi-${lang.code} !w-full !h-full rounded-full`}
                    ></span>
                  </div>

                  <span className="line-clamp-1 whitespace-normal break-words text-center text-base font-medium text-black --webkit-line-clamp-1">
                    {lang.name}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="grid-cols-none grid-rows-none flex items-center justify-center col-span-full text-black font-semibold text-lg">
                No found
              </p>
            )}
          </div>
          {/* <button
            className="flex flex-col items-center p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition"
            onClick={() => handleLanguageSelect("Other languages")}
          >
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center mb-2">
              <span className="text-gray-400">+</span>
            </div>
            <span className="text-sm text-gray-700">Other languages</span>
          </button> */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search language..."
              value={inputValue}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35M16.65 10.5A6.15 6.15 0 1110.5 4.35a6.15 6.15 0 016.15 6.15z"
                />
              </svg>
            </span>
          </div>
          <button
            className="w-full bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 transition disabled:bg-blue-400 rounded-xl"
            onClick={handleContinue}
            disabled={!selectedLanguage}
          >
            Continue
          </button>
          <p className="text-center text-sm text-gray-500 mt-4 font-medium">
            Already a member?
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

export default LanguageConfig;
