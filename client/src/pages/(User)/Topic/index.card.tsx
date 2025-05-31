import CustomCard from "@/components/card/custom-card";
import { useEffect, useState } from "react";
import bg_pronunciation from "@/assets/user/bg_pronunciation.jpg";
import { apiGetLessonByParentTopicId } from "@/services/lesson.services";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
const ListCardTopic = () => {
  const [topicData, setTopicData] = useState([]);
  const navigate = useNavigate();
  const { topicId } = useParams();
  const location = useLocation();

  const { topic } = location.state || {};
  const getAllTopic = async (topicId) => {
    const response = await apiGetLessonByParentTopicId(topicId);
    if (response?.data?.success) {
      setTopicData(response?.data?.rs);
    }
  };
  useEffect(() => {
    getAllTopic(topicId);
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
      <div className="grid grid-cols-3 w-5/6 mx-auto sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 bg-gray-200 rounded-lg shadow-md overflow-y-auto scrollbar-hide max-h-full scrollbar-thin scrollbar-thumb-gray-300">
        {topicData?.map((topic) => (
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
              thumbnail={bg_pronunciation}
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
