import auth from "@/assets/user/icon-auth.jpeg";
import { apiGetLessonById } from "@/services/lesson.services";
import { Lesson } from "@/types/lesson";
import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useParams } from "react-router-dom";
const Speech = () => {
  const [lessonData, setLessonData] = useState<Lesson | null>({});
  const { lessonId } = useParams();
  console.log(lessonId);
  const getLessonById = async (lessonId) => {
    const response = await apiGetLessonById(lessonId);
    if (response?.data?.success) setLessonData(response?.data?.rs);
  };
  useEffect(() => {
    getLessonById(lessonId);
  }, [lessonId]);
  return (
    <div>
      <div className="py-6 flex flex-col gap-10">
        <div className="flex items-center justify-start gap-2">
          <MdKeyboardArrowLeft
            size={40}
            className="cursor-pointer"
            onClick={() => history.back()}
          />
          <span className="text-xl font-semibold"> {lessonData?.title}</span>
        </div>
        <div className="flex flex-col gap-12">
          <div className="flex items-center gap-4">
            <img className="w-16 h-16 rounded-full" src={auth} alt="auth" />
            <div className="flex flex-col justify-center">
              <span className="text-[18px] font-medium">Cashier</span>
              <span className="text-[12px] font-base">Assitant</span>
            </div>
          </div>
          <div className="w-1/2 ">
            <span>
              You are at a bus station. You want to go to a city nearby. You
              need help finding the right bus. Talk to the station assistant to
              ask about the bus number, the tickets and the schedule.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speech;
