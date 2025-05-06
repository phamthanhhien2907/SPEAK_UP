import Box from "@mui/material/Box";
import { useSelectedPageContext } from "@/hooks/use-context";
import SliderProvider from "../slider/slider-provider";
import ListProvider from "../list/list-provider";
import {
  apiGetAllLesson,
  apiGetParentLesson,
} from "@/services/lesson.services";
import { useEffect, useState } from "react";
import CustomCard from "./custom-card";
export default function CardItem() {
  const [lessonData, setLessonData] = useState([]);
  const [parentLessonData, setParentLessonData] = useState([]);
  const { selectedPage } = useSelectedPageContext();
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
                  <CustomCard
                    data="lesson"
                    title={lesson?.title}
                    description={lesson?.content}
                    thumbnail={lesson?.thumbnail}
                    key={lesson?._id}
                    id={lesson?._id}
                  />
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
                  <CustomCard
                    data="parentLesson"
                    id={parentLesson?._id}
                    key={parentLesson?._id}
                    description={parentLesson?.progress}
                    title={parentLesson?.title}
                    thumbnail={parentLesson?.thumbnail}
                  />
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
