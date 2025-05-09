import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import auth from "@/assets/user/icon-auth.jpeg";
import { apiGetLessonById } from "@/services/lesson.services";
import { Lesson } from "@/types/lesson";

import { MdKeyboardArrowLeft, MdMicNone } from "react-icons/md";
import { FiSettings } from "react-icons/fi";

const Speech = () => {
  const [lessonData, setLessonData] = useState<Lesson | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const { lessonId } = useParams();
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const getLessonById = async (lessonId: string) => {
    const response = await apiGetLessonById(lessonId);
    if (response?.data?.success) setLessonData(response?.data?.rs);
  };

  useEffect(() => {
    if (lessonId) getLessonById(lessonId);
  }, [lessonId]);

  const handleMicClick = () => {
    if (!browserSupportsSpeechRecognition) {
      alert("Trình duyệt của bạn không hỗ trợ Speech Recognition");
      return;
    }

    if (isListening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }

    setIsListening(!isListening);
  };

  return (
    <div className="flex flex-col h-full pt-6 pb-20 relative bg-white px-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MdKeyboardArrowLeft
            size={32}
            className="cursor-pointer"
            onClick={() => history.back()}
          />
          <h6 className="text-xl font-semibold ">
            Speaking: {lessonData?.title}
          </h6>
        </div>
        <button
          onClick={() => setShowSidebar(true)}
          className="text-gray-600 hover:text-gray-900"
        >
          <FiSettings size={24} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col gap-6 overflow-y-auto flex-1">
        {/* Assistant */}
        <div className="flex  gap-4 items-center">
          <img src={auth} className="w-16 h-16 rounded-full" alt="Assistant" />
          <div className="bg-gray-100 px-4 py-3 rounded-xl shadow max-w-md">
            <p className="text-gray-800 text-xl">
              {lessonData?.content || "You are at a bus station..."}
            </p>
            <div className="flex gap-4 mt-2 text-sm text-blue-600">
              <button className="hover:underline">🔁 Repeat</button>
              <button className="hover:underline">🌐 Translate</button>
            </div>
          </div>
        </div>

        {/* User */}
        {transcript && (
          <div className="flex items-start justify-end gap-4">
            <div className="bg-blue-100 px-4 py-3 rounded-xl shadow max-w-md">
              <p className="text-gray-800 text-xl">{transcript}</p>
            </div>
            <img src={auth} className="w-16 h-16 rounded-full" alt="User" />
          </div>
        )}
      </div>

      {/* Mic button */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div
          className={`p-4 rounded-full ${
            isListening ? "bg-red-600" : "bg-blue-600"
          } shadow-lg cursor-pointer`}
          onClick={handleMicClick}
        >
          <MdMicNone size={32} className="text-white" />
        </div>
      </div>

      {/* Right Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[460px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          showSidebar ? "translate-x-0" : "translate-x-full"
        } rounded-l-2xl border-l`}
      >
        <div className="flex justify-between items-center p-5 border-b text-lg font-semibold">
          Settings
          <button
            onClick={() => setShowSidebar(false)}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5 text-[15px]">
          {/* Translation Language */}
          <div>
            <label className="block mb-2 font-medium">
              Choose translation language
            </label>
            <div className="flex items-center justify-between gap-2 border rounded-xl px-4 py-2 hover:shadow cursor-pointer transition">
              <img
                src="https://flagcdn.com/w40/za.png"
                alt="Afrikaans"
                className="w-5 h-5"
              />
              <span className="flex-1 ml-2">Afrikaans</span>
              <button className="text-gray-400 hover:text-black">🔍</button>
            </div>
          </div>

          {/* Target Language */}
          <div>
            <label className="block mb-2 font-medium">
              Choose target language
            </label>
            <div className="flex items-center justify-between gap-2 border rounded-xl px-4 py-2 hover:shadow cursor-pointer transition">
              <img
                src="https://flagcdn.com/w40/gb.png"
                alt="English"
                className="w-5 h-5"
              />
              <span className="flex-1 ml-2">English</span>
              <button className="text-gray-400 hover:text-black">🔍</button>
            </div>
          </div>

          <hr className="border-t" />

          {/* Logout */}
          <div>
            <button className="w-full flex items-center justify-center gap-2 text-red-600 font-semibold border border-red-600 rounded-xl px-4 py-2 hover:bg-red-50 transition">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speech;
