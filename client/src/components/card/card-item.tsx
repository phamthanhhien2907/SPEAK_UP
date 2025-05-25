import Box from "@mui/material/Box";
import { useSelectedPageContext } from "@/hooks/use-context";
import SliderProvider from "../slider/slider-provider";
import ListProvider from "../list/list-provider";
import { apiGetAllLesson } from "@/services/lesson.services";
import bg_lesson from "@/assets/user/bg_lesson.jpg";
import bg_course from "@/assets/user/bg_course.png";

import { lazy, Suspense, useEffect, useState } from "react";
import CustomCard from "./custom-card";
import { useNavigate } from "react-router-dom";
import { features, gameTypes } from "@/lib/helper";
import Progress from "@/pages/(User)/Progress";
import Settings from "@/pages/(User)/Settings";
import { apiGetAllTopic } from "@/services/topic.services";
const ChatPage = lazy(() => import("@/pages/(User)/Chat/index"));

export default function CardItem() {
  const [lessonAIConversationData, setLessonAIConversationData] = useState([]);
  const [topicData, setTopicData] = useState([]);
  const { selectedPage } = useSelectedPageContext();
  const navigation = useNavigate();
  const getAllTopicLesson = async () => {
    const response = await apiGetAllTopic();
    if (response?.data?.success) {
      const sectionLesson = response?.data?.rs?.filter(
        (item) => item.section === "lesson"
      );
      setTopicData(sectionLesson);
    }
  };

  const getLessonAIConversationEnable = async () => {
    const response = await apiGetAllLesson();
    if (response?.data?.success) {
      const lessonAIConversation = response?.data?.rs?.filter(
        (item) => item.isAIConversationEnabled === true
      );
      setLessonAIConversationData(lessonAIConversation);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAllTopicLesson(), getLessonAIConversationEnable()]);
    };
    fetchData();
  }, []);
  const renderContent = () => {
    switch (selectedPage) {
      case "Home":
        return (
          <>
            <section className="flex-1 overflow-auto bg-gray-50 scrollbar-hide">
              <h6 className="text-2xl font-bold pt-8 justify-center flex items-center">
                Các cuộc đàm thoại
              </h6>
              <Box
                sx={{
                  // maxHeight: "80vh",
                  width: "100%",
                  maxWidth: "1200px",
                  padding: "16px",
                }}
              >
                {lessonAIConversationData?.map((lesson) => (
                  <div
                    key={lesson?._id}
                    onClick={() => navigation(`/speech/${lesson?._id}`)}
                  >
                    <CustomCard
                      data="lesson"
                      title={lesson?.title}
                      description={lesson?.content}
                      thumbnail={lesson?.thumbnail}
                      category={lesson?.category}
                    />
                  </div>
                ))}
              </Box>
            </section>
            <section className="w-full md:w-[550px] pr-4 pt-4 bg-gray-100 flex items-center flex-col gap-4">
              <h6 className="font-bold text-2xl">Trang chủ</h6>
              <span className="font-semibold text-end w-full px-16 cursor-pointer">
                Xem tất cả
              </span>
              <SliderProvider
                widthClass="w-[80%]"
                heightClass="min-h-[250px]"
              />
              <div className="flex flex-col items-center justify-center gap-4">
                <h6 className="font-bold text-xl">
                  Hôm nay, chúng ta nên làm gì?
                </h6>
                <ListProvider />
              </div>
            </section>
          </>
        );
      case "Lesson":
        return (
          <>
            <section className="flex-1 overflow-auto bg-gray-50 scrollbar-hide">
              <h6 className="text-2xl font-bold pt-8 justify-center flex items-center">
                Gợi ý cho bạn
              </h6>
              <Box
                sx={{
                  // maxHeight: "80vh",
                  width: "100%",
                  maxWidth: "1200px",
                  padding: "16px",
                }}
              >
                {topicData?.map((topicLesson) => (
                  <div
                    onClick={() => navigation(`/lesson/${topicLesson?._id}`)}
                    key={topicLesson?._id}
                  >
                    <CustomCard
                      data="parentLesson"
                      description={topicLesson?.content}
                      title={topicLesson?.title}
                      thumbnail={topicLesson?.thumbnail}
                      progressText={topicLesson?.progressText}
                    />
                  </div>
                ))}
              </Box>
            </section>
            <section className="w-full md:w-[550px] pr-4 pt-4 bg-gray-100 flex items-center flex-col gap-4">
              <div className="w-full px-8 flex flex-col gap-4">
                <div className="relative cursor-pointer">
                  <img
                    src={bg_lesson}
                    alt="background"
                    className="rounded-xl shadow-gray-500"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl"></div>
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  text-white text-3xl font-mono font-bold drop-shadow-xl shadow-2xl">
                    Bài học
                  </span>
                </div>
                <div
                  className="relative cursor-pointer"
                  onClick={() => navigation("/topic")}
                >
                  <img
                    src={bg_course}
                    alt="background"
                    className="rounded-xl shadow-gray-500"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-xl"></div>
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  text-white text-3xl font-mono font-bold drop-shadow-xl shadow-2xl">
                    Chủ đề
                  </span>
                </div>
              </div>
            </section>
          </>
        );
      case "Explore":
        return (
          <>
            <section className="flex-1 overflow-auto bg-gray-50 scrollbar-hide">
              <h6 className="text-2xl font-bold pt-8 justify-center flex items-center">
                Phân tích giọng nói
              </h6>
              <Box
                sx={{
                  // maxHeight: "80vh",
                  width: "100%",
                  maxWidth: "1200px",
                  padding: "16px",
                }}
              >
                {features?.map((feature, index) => (
                  <div key={index}>
                    <CustomCard
                      data="explore"
                      description={feature?.description}
                      title={feature?.title}
                      thumbnail={feature?.icon}
                    />
                  </div>
                ))}
              </Box>
            </section>
            <section className="w-full md:w-[550px] pr-4 pt-4 bg-gray-100 flex flex-col gap-4 items-center">
              <h6 className="text-2xl font-bold pt-8 justify-center flex items-center">
                Loại trò chơi
              </h6>

              <div className="grid grid-cols-3 gap-x-4 gap-y-8 px-8 w-full">
                {gameTypes?.map((gameType, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <img
                      className={`w-20 h-20 object-cover bg-${gameType?.colorBackground} `}
                      src={gameType?.icon}
                      alt={gameType?.title}
                    />
                    <span className="text-center font-medium mt-2">
                      {gameType?.title}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        );
      case "Progress":
        return <Progress />;
      case "Profile":
        return <Settings />;
      case "Chat":
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <ChatPage />
          </Suspense>
        );
      case "Settings":
        return <Settings />;
      default:
        return <Settings />;
    }
  };
  return <>{renderContent()}</>;
}
