import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ConfirmModal from "@/components/modals/confirm-modal";
import { apiGetLessonByParent } from "@/services/lesson.services";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Button } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAnimation } from "framer-motion";
import { ScrollInfinite } from "@/components/scroll-infinite";

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
  pagination: {
    currentPage: number;
    totalLessons: number;
    totalPages: number;
    hasMore: boolean;
  };
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 50,
    transition: { ease: [0.78, 0.14, 0.15, 0.86] },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.78, 0.14, 0.15, 0.86], duration: 0.6 },
  },
};

const TopicDetails = () => {
  const [lessonTopicData, setLessonTopicData] = useState<LevelData | null>(
    null
  );
  const [lessons, setLessons] = useState<Lesson[]>([]); // State for lessons
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const { topicId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start("show");
    }
  }, [controls, inView]);

  const getLessonByParentTopicId = async (topicId: string | undefined) => {
    try {
      const response = await apiGetLessonByParent(topicId);
      if (response?.data) {
        setLessonTopicData(response?.data);
        setLessons(response?.data?.lessons || []);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };
  useEffect(() => {
    getLessonByParentTopicId(topicId);
  }, [topicId]);
  const totalLessons = lessons.length || 0;
  const completedLessons = lessons.filter((l) => l?.score >= 60).length || 0;
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleLessonClick = (lesson: Lesson, index: number) => {
    if (index > 0 && lessons[index - 1]?.score < 60) {
      return;
    }
    if (lesson.score >= 60) {
      setSelectedLesson(lesson);
      setShowConfirmModal(true);
    } else {
      navigate(`/topic-excercise/${lesson?.lessonId}`, {
        state: { lesson, lessonIndex: index },
      });
    }
  };

  if (!lessons.length) {
    return (
      <div id="load">
        <div>G</div>
        <div>N</div>
        <div>I</div>
        <div>D</div>
        <div>A</div>
        <div>O</div>
        <div>L</div>
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={item}
      initial="hidden"
      animate={controls}
      style={{ width: "100%" }}
    >
      <div className="w-full h-full flex flex-col gap-4 px-4 relative">
        <div className="flex items-center gap-4 px-24">
          <div className="flex items-center justify-center w-full">
            <div className="w-9 h-9 bg-gray-400 rounded-full flex items-center justify-center">
              <MdKeyboardArrowLeft
                size={37}
                color="white"
                className="text-gray-700 cursor-pointer hover:text-gray-900"
                onClick={() => navigate(-1)}
              />
            </div>
            <div className="flex items-center justify-center gap-2 text-center mx-auto">
              <h6 className="text-2xl font-bold text-gray-800">
                {location.state?.topic?.title}
              </h6>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center mx-auto py-8">
          <Button
            variant="contained"
            className="w-42 h-8 mb-4 !rounded-full !capitalize"
          >
            Mixed Skills
          </Button>
        </div>

        {/* Progress */}
        <div className="w-full max-w-5xl mx-auto text-right text-gray-700 font-medium flex items-center">
          <span>
            {completedLessons}/{totalLessons}
          </span>
          <div className="flex items-center justify-center gap-2 text-center mx-auto">
            <span>{lessonTopicData?.levelName}</span>
          </div>
        </div>
        <div
          className={`w-full max-w-5xl mx-auto flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-120px)] scrollbar-thin scrollbar-thumb-gray-300 transition-all duration-300 relative`}
        >
          <InfiniteScroll
            dataLength={lessons?.length}
            next={() => {}}
            hasMore={true}
            loader={<h4 className="hidden"></h4>}
            className="scrollbar-hide"
          >
            <motion.ul initial="hidden" animate="show" variants={container}>
              {lessons.map((lesson, index) => {
                const isLocked = index > 0 && lessons[index - 1]?.score < 60;
                return (
                  <ScrollInfinite
                    key={lesson.lessonId}
                    lesson={lesson}
                    index={index}
                    onClick={() =>
                      !isLocked && handleLessonClick(lesson, index)
                    }
                  />
                );
              })}
            </motion.ul>
          </InfiniteScroll>

          {showConfirmModal && selectedLesson && (
            <ConfirmModal
              title="Làm lại bài học?"
              message="Bài học này đã hoàn thành. Bạn có chắc chắn muốn làm lại không?"
              confirmText="Làm lại"
              cancelText="Hủy"
              onCancel={() => setShowConfirmModal(false)}
              onConfirm={() => {
                navigate(`/topic-excercise/${selectedLesson?.lessonId}`, {
                  state: {
                    lesson: selectedLesson,
                    lessonIndex: lessons.findIndex(
                      (l) => l?.lessonId === selectedLesson?.lessonId
                    ),
                  },
                });
                setShowConfirmModal(false);
              }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TopicDetails;
