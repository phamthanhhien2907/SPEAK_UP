import bg_pronunciation from "@/assets/user/bg_pronunciation.jpg";
import { apiGetLessonByParent } from "@/services/lesson.services";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCheck,
  FaPlay,
  FaMicrophone,
  FaHeadphones,
  FaLock,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import ConfirmModal from "../modals/confirm-modal";

type Lesson = {
  lessonId: string;
  title: string;
  score: number;
  isCompleted: boolean;
};

type LevelData = {
  introVideo: string;
  progress: string;
  levelName: string;
  lessons: Lesson[];
};

const ListCard = () => {
  const [lessonByParentData, setLessonByParentData] =
    useState<LevelData | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { parentLessonId } = useParams();
  const navigate = useNavigate();

  const getLessonByParent = async (parentLessonId: string | undefined) => {
    const response = await apiGetLessonByParent(parentLessonId);
    if (response?.data) setLessonByParentData(response?.data);
  };

  useEffect(() => {
    getLessonByParent(parentLessonId);
  }, [parentLessonId]);

  const levelTitle = lessonByParentData?.levelName
    ?.split("-")[1]
    ?.replace("?", "")
    .trim();
  const totalLessons = lessonByParentData?.lessons?.length || 0;
  const completedLessons =
    lessonByParentData?.lessons?.filter((l) => l.score >= 60).length || 0;
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleLessonClick = (lesson, index) => {
    // Check if the lesson is locked (previous lesson not completed)
    if (index > 0 && lessonByParentData?.lessons[index - 1].score < 60) {
      return; // Do nothing if locked
    }

    if (lesson.score >= 60) {
      setSelectedLesson(lesson);
      setShowConfirmModal(true);
    } else {
      navigate(`/vocabulary/${lesson.lessonId}`, {
        state: { lesson, lessonIndex: index },
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 px-4 relative">
      {/* Banner */}
      <div className="relative w-full flex justify-center">
        <img
          alt="background"
          src={bg_pronunciation}
          className="w-full max-w-5xl h-[300px] object-cover rounded-xl shadow-xl"
        />
        <div className="absolute inset-0 bg-black/50 rounded-xl max-w-5xl mx-auto"></div>
        <h6 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-semibold z-20 text-center px-4">
          {levelTitle}
        </h6>
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex items-center z-30">
          <div className="bg-white rounded-xl px-4 py-2 shadow-lg flex items-center space-x-3">
            <span className="text-gray-800 text-xl font-semibold min-w-[48px] text-center">
              {progressPercentage}%
            </span>
            <div className="w-36 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-500 ${
                  progressPercentage >= 99.5 ? "rounded-full" : "rounded-l-full"
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto bg-white p-4 rounded-xl shadow-md flex items-center justify-between hover:shadow-lg transition">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <FaPlay size={18} className="text-white" />
          </div>
          <span className="text-base font-medium">
            {lessonByParentData?.introVideo}
          </span>
        </div>
        <IoIosArrowForward size={28} className="text-gray-500" />
      </div>

      {/* Progress */}
      <div className="w-full max-w-5xl mx-auto text-right text-gray-700 font-medium">
        Hoàn thành: {completedLessons}/{totalLessons} bài học
      </div>

      {/* Lesson List (Drawer) */}
      <div
        className={`w-full max-w-5xl mx-auto flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-300 transition-all duration-300 relative `}
      >
        {lessonByParentData?.lessons?.map((lesson, index) => {
          const isListening = index % 2 !== 0; // Start with headphone (speaking) at index 0
          const Icon = isListening ? FaMicrophone : FaHeadphones;
          const isLocked =
            index > 0 && lessonByParentData?.lessons[index - 1].score < 60;

          return (
            <div
              onClick={() => !isLocked && handleLessonClick(lesson, index)}
              key={lesson.lessonId}
              className={`group flex items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm transition ${
                isLocked
                  ? "cursor-not-allowed opacity-50"
                  : "hover:shadow-md cursor-pointer hover:bg-blue-500"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold text-sm ${
                    lesson.score >= 60
                      ? "bg-green-500"
                      : isLocked
                      ? "bg-gray-400"
                      : "bg-blue-500 group-hover:bg-white group-hover:text-black"
                  } `}
                >
                  {lesson.score >= 60 ? (
                    <FaCheck size={16} />
                  ) : isLocked ? (
                    <FaLock size={16} />
                  ) : (
                    <Icon size={16} />
                  )}
                </div>
                <span
                  className={`text-lg font-medium ${
                    isLocked ? "text-gray-500" : "group-hover:text-white"
                  }`}
                >
                  {lesson.title}
                </span>
              </div>
            </div>
          );
        })}
        {showConfirmModal && selectedLesson && (
          <ConfirmModal
            title="Làm lại bài học?"
            message="Bài học này đã hoàn thành. Bạn có chắc chắn muốn làm lại không?"
            confirmText="Làm lại"
            cancelText="Hủy"
            onCancel={() => setShowConfirmModal(false)}
            onConfirm={() => {
              navigate(`/vocabulary/${selectedLesson.lessonId}`, {
                state: {
                  lesson: selectedLesson,
                  lessonIndex: lessonByParentData?.lessons.findIndex(
                    (l) => l.lessonId === selectedLesson.lessonId
                  ),
                },
              });
              setShowConfirmModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ListCard;
