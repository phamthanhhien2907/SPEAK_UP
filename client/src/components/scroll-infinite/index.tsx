import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { FaCheck, FaMicrophone, FaHeadphones, FaLock } from "react-icons/fa";
type Lesson = {
  lessonId: string;
  title: string;
  score: number;
  isCompleted: boolean;
};
export const ScrollInfinite = ({
  lesson,
  index,
  onClick,
}: {
  lesson: Lesson;
  index: number;
  onClick: () => void;
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("show");
    }
  }, [controls, inView]);

  const item = {
    hidden: {
      opacity: 0,
      y: 50,
      transition: { ease: [0.78, 0.14, 0.15, 0.86] },
    },
    show: {
      opacity: 1,
      y: 0,
      transition: { ease: [0.78, 0.14, 0.15, 0.86] },
    },
  };

  const isListening = index % 2 !== 0;
  const Icon = isListening ? FaMicrophone : FaHeadphones;
  const isLocked = index > 0 && lesson.score < 60;

  return (
    <motion.li
      variants={item}
      initial="hidden"
      animate={controls}
      ref={ref}
      onClick={onClick}
      className={`group flex items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm transition  ${
        isLocked
          ? "cursor-not-allowed opacity-50"
          : "hover:shadow-md cursor-pointer hover:bg-blue-500"
      }`}
    >
      <div className="flex items-center gap-4 ">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold text-sm ${
            lesson.score >= 60
              ? "bg-green-500"
              : isLocked
              ? "bg-gray-400"
              : "bg-blue-500 group-hover:bg-white group-hover:text-black"
          }`}
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
    </motion.li>
  );
};
