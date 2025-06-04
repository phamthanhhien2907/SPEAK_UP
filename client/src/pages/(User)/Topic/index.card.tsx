import CustomCard from "@/components/card/custom-card";
import { useEffect, useState } from "react";
import bg_pronunciation from "@/assets/user/bg_pronunciation.jpg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { apiGetLessonByParentTopicId } from "@/services/lesson.services";
const ListCardTopic = () => {
  const [lessonData, setLessonData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { topicId } = useParams();
  const { topic } = location.state || {};
  const getAllLessonByTopicId = async (topicId) => {
    const response = await apiGetLessonByParentTopicId(topicId);
    console.log(response?.data);
    if (response?.data?.success) {
      const filterParentLesson = response?.data?.rs?.filter(
        (lesson) => lesson?.parentLessonId === null
      );
      setLessonData(filterParentLesson);
    }
  };
  console.log(lessonData);
  useEffect(() => {
    getAllLessonByTopicId(topicId);
  }, [topicId]);
  return (
    <div>
      <div className="flex items-center gap-4 px-24">
        <MdKeyboardArrowLeft
          size={45}
          className="text-gray-700 cursor-pointer hover:text-gray-900"
          onClick={() => history.back()}
        />
        <h6 className="text-2xl font-bold text-gray-800">{topic?.title}</h6>
      </div>
      <div className="grid grid-cols-3 w-5/6 mx-auto sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 rounded-lg overflow-y-auto scrollbar-hide max-h-full scrollbar-thin scrollbar-thumb-gray-300">
        {lessonData?.map((topic) => (
          <div
            key={topic?._id}
            onClick={() =>
              navigate(`/topic/${topic?._id}/${topic?.title}`, {
                state: { topic },
              })
            }
          >
            <CustomCard
              title={topic?.title}
              description={topic?.content}
              thumbnail={topic?.thumbnail ? topic?.thumbnail : bg_pronunciation}
              data="topicCard"
              totalLesson={topic?.parentTopicId?.totalLessons}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListCardTopic;
