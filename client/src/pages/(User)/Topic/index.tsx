import bg_pronunciation from "@/assets/user/bg_pronunciation.jpg";
import SliderProvider from "@/components/slider/slider-provider";
import CustomCard from "@/components/card/custom-card";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { apiGetAllTopic } from "@/services/topic.services";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Topic = () => {
  const [topicData, setTopicData] = useState([]);
  const navigation = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true, // Only trigger the animation once
    threshold: 0.1, // Trigger when 10% of the card is in view
  });

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
      transition: { ease: [0.78, 0.14, 0.15, 0.86], duration: 0.6 },
    },
  };
  const getAllTopic = async () => {
    const response = await apiGetAllTopic();
    if (response?.data?.success) {
      const sectionTopic = response?.data?.rs?.filter(
        (item) => item.section === "topic"
      );
      setTopicData(sectionTopic);
    }
  };
  useEffect(() => {
    getAllTopic();
  }, []);
  if (!topicData?.length) {
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
            Topic
          </h6>
        </div>

        <div className="w-full max-w-5xl mx-auto bg-white p-4 rounded-xl shadow-md flex items-center justify-between hover:shadow-lg transition">
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium">Categories</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-medium">See all</span>
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
            <span className="text-lg font-medium">Common</span>
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
          {topicData?.map((topic) => (
            <div
              key={topic?._id}
              onClick={() =>
                navigation(`/topic/${topic?._id}`, {
                  state: { topic },
                })
              }
            >
              <CustomCard
                title={topic?.title}
                description={topic?.content}
                thumbnail={
                  topic?.thumbnail ? topic?.thumbnail : bg_pronunciation
                }
                data="topic"
                totalLesson={topic?.totalLessons}
              />
            </div>
          ))}
        </Box>
      </div>
    </motion.div>
  );
};

export default Topic;
