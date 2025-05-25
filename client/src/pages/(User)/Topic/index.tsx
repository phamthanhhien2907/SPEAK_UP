import bg_pronunciation from "@/assets/user/bg_pronunciation.jpg";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SliderProvider from "@/components/slider/slider-provider";
import CustomCard from "@/components/card/custom-card";
import { Box } from "@mui/material";
import { apiGetAllTopic } from "@/services/topic.services";
const listCard = [
  {
    id: 1,
    title: "Revisiting Everyday Conversations",
    description: "Ôn lại các cuộc trò chuyện hằng ngày bằng khóa học",
    totalLesson: "33 bài học",
    thumbnail: bg_pronunciation,
  },
  {
    id: 2,
    title: "Revisiting Everyday Conversations",
    description: "Ôn lại các cuộc trò chuyện hằng ngày bằng khóa học",
    totalLesson: "33 bài học",
    thumbnail: bg_pronunciation,
  },
  {
    id: 3,
    title: "Revisiting Everyday Conversations",
    description: "Ôn lại các cuộc trò chuyện hằng ngày bằng khóa học",
    totalLesson: "33 bài học",
    thumbnail: bg_pronunciation,
  },
  {
    id: 4,
    title: "Revisiting Everyday Conversations",
    description: "Ôn lại các cuộc trò chuyện hằng ngày bằng khóa học",
    totalLesson: "33 bài học",
    thumbnail: bg_pronunciation,
  },
  {
    id: 5,
    title: "Revisiting Everyday Conversations",
    description: "Ôn lại các cuộc trò chuyện hằng ngày bằng khóa học",
    totalLesson: "33 bài học",
    thumbnail: bg_pronunciation,
  },
];
const Topic = () => {
  const [lessonTopicData, setLessonTopicData] = useState([]);
  const navigation = useNavigate();
  const getAllTopicLesson = async () => {
    const response = await apiGetAllTopic();
    if (response?.data?.success) {
      const sectionTopic = response?.data?.rs?.filter(
        (item) => item.section === "topic"
      );
      setLessonTopicData(sectionTopic);
    }
  };
  console.log(lessonTopicData);
  useEffect(() => {
    getAllTopicLesson();
  }, []);
  return (
    <div className="w-full h-full flex flex-col gap-4 px-4 relative overflow-y-auto max-h-full scrollbar-thin scrollbar-thumb-gray-300">
      {/* Banner */}
      <div className="relative w-full flex justify-center">
        <img
          alt="background"
          src={bg_pronunciation}
          className="w-full max-w-5xl h-[300px] object-cover rounded-xl shadow-xl"
        />
        <div className="absolute inset-0 bg-black/50 rounded-xl max-w-5xl mx-auto"></div>
        <h6 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-semibold z-20 text-center px-4">
          Chủ đề
        </h6>
      </div>

      <div className="w-full max-w-5xl mx-auto bg-white p-4 rounded-xl shadow-md flex items-center justify-between hover:shadow-lg transition">
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium">Danh mục</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium">Xem tất cả</span>
        </div>
      </div>
      <div
        className={`w-full max-w-5xl mx-auto scrollbar-thin scrollbar-thumb-gray-300 transition-all duration-300 `}
      >
        <SliderProvider
          widthClass="w-[100%]"
          heightClass="h-[550px] min-h-[400px] max-h-[400px]"
          type="topic"
        />
      </div>
      <div className="w-full max-w-5xl mx-auto bg-white p-4 rounded-xl shadow-md flex items-center justify-between hover:shadow-lg transition">
        <div className="flex items-center gap-3">
          <span className="text-lg font-medium">Đang thịnh hành</span>
        </div>
      </div>
      <Box
        sx={{
          // maxHeight: "80vh",
          padding: "16px",
          height: "550px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          width: "100%",
          maxWidth: "85%",
          mx: "auto",
          gap: 4,
        }}
      >
        {listCard?.map((card) => (
          <div key={card?.id}>
            <CustomCard
              data="card"
              title={card?.title}
              description={card?.title}
              thumbnail={card?.thumbnail}
              category={card?.description}
              totalLesson={card?.totalLesson}
            />
          </div>
        ))}
      </Box>
    </div>
  );
};

export default Topic;
