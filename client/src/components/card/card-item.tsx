import Box from "@mui/material/Box";
import { useSelectedPageContext } from "@/hooks/use-context";
import SliderProvider from "../slider/slider-provider";
import ListProvider from "../list/list-provider";
import {
  apiGetAllLesson,
  apiGetParentLesson,
} from "@/services/lesson.services";
import bg_lesson from "@/assets/user/bg_lesson.jpg";
import bg_course from "@/assets/user/bg_course.png";

import { useEffect, useState } from "react";
import CustomCard from "./custom-card";
import { useNavigate } from "react-router-dom";
export default function CardItem() {
  const [lessonData, setLessonData] = useState([]);
  const [parentLessonData, setParentLessonData] = useState([]);
  const { selectedPage } = useSelectedPageContext();
  const navigation = useNavigate();

  const getAllLesson = async () => {
    const response = await apiGetAllLesson();
    if (response?.data?.success) {
      const lessonType = response?.data?.rs?.filter(
        (lesson) => lesson?.type === "speaking"
      );
      setLessonData(lessonType);
    }
  };
  const getParentLesson = async () => {
    const response = await apiGetParentLesson();
    if (response?.data) setParentLessonData(response?.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([getAllLesson(), getParentLesson()]);
    };
    fetchData();
  }, []);
  const renderContent = () => {
    switch (selectedPage) {
      case "Trang chủ":
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
                {lessonData?.map((lesson) => (
                  <div onClick={() => navigation(`/speech/${lesson?._id}`)}>
                    <CustomCard
                      data="lesson"
                      title={lesson?.title}
                      description={lesson?.content}
                      thumbnail={lesson?.thumbnail}
                      key={lesson?._id}
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
              <SliderProvider />
              <div className="flex flex-col items-center justify-center gap-4">
                <h6 className="font-bold text-xl">
                  Hôm nay, chúng ta nên làm gì?
                </h6>
                <ListProvider />
              </div>
            </section>
          </>
        );
      case "Bài học":
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
                {parentLessonData?.map((parentLesson) => (
                  <div
                    onClick={() =>
                      navigation(`/lesson/${parentLesson?.lessonId}`)
                    }
                    key={parentLesson?.lessonId}
                  >
                    <CustomCard
                      data="parentLesson"
                      description={parentLesson?.progress}
                      title={parentLesson?.title}
                      thumbnail={parentLesson?.thumbnail}
                    />
                  </div>
                ))}
              </Box>
            </section>
            <section className="w-full md:w-[550px] pr-4 pt-4 bg-gray-100 flex items-center flex-col gap-4">
              <div className="w-full px-8 flex flex-col gap-4">
                <div className="relative">
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
                <div className="relative">
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
      case "Khám phá":
        return (
          <div className="p-4 text-xl">
            Tính năng khám phá đang được phát triển.
          </div>
        );
      case "Tiến độ":
        return (
          <div className="p-4 text-xl">
            Tính năng khám phá đang được phát triển.
          </div>
        );
      default:
        return (
          <div className="p-4 text-xl">
            Chọn một mục trong thanh điều hướng.
          </div>
        );
    }
  };
  return <>{renderContent()}</>;
}
