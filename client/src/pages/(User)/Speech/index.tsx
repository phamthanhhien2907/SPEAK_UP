import auth from "@/assets/user/icon-auth.jpeg";
import { apiGetLessonById } from "@/services/lesson.services";
import { Lesson } from "@/types/lesson";
import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { HiOutlineVolumeUp } from "react-icons/hi";
import { GrLanguage } from "react-icons/gr";
import { MdMicNone } from "react-icons/md";
import { FiSettings } from "react-icons/fi";
import { BiRevision } from "react-icons/bi";
import { PiTranslate } from "react-icons/pi";
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
    <div className="py-6 flex flex-col w-full h-full justify-between">
      <div className="flex flex-col gap-10 h-5/6 w-full overflow-y-auto">
        <div className="flex items-center justify-start gap-2">
          <MdKeyboardArrowLeft
            size={40}
            className="cursor-pointer"
            onClick={() => history.back()}
          />
          <span className="text-xl font-semibold"> {lessonData?.title}</span>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-start">
              <div className="flex-[1.2] flex flex-col items-start gap-14">
                <div className="flex items-center gap-4">
                  <img
                    className="w-16 h-16 rounded-full"
                    src={auth}
                    alt="auth"
                  />
                  <div className="flex flex-col justify-center">
                    <span className="text-[18px] font-medium">Cashier</span>
                    <span className="text-[12px] font-base">Assitant</span>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col items-start gap-2">
                    <span>
                      You are at a bus station. You want to go to a city nearby.
                      You need help finding the right bus. Talk to the station
                      assistant to ask about the bus number, the tickets and the
                      schedule.
                    </span>
                    <div className="flex items-center gap-8">
                      <div className="group flex items-center gap-2 rounded-full hover:bg-blue-600 py-1 px-2 justify-center cursor-pointer">
                        <BiRevision
                          size={16}
                          className="text-gray-500 group-hover:text-white"
                        />
                        <span className="text-sm text-gray-500 group-hover:text-white">
                          Repeat
                        </span>
                      </div>
                      <div className="group flex items-center gap-2 rounded-full hover:bg-blue-600 py-1 px-2 justify-center cursor-pointer">
                        <PiTranslate
                          size={16}
                          className="text-gray-500 group-hover:text-white"
                        />
                        <span className="text-sm text-gray-500 group-hover:text-white">
                          Translate
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-[0.8] flex items-center justify-end px-20 gap-4 pt-4">
                <HiOutlineVolumeUp size={25} />
                <FiSettings size={20} />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex items-start w-full">
              <div className="flex-[1.2] flex flex-col items-start gap-14 justify-end">
                <div className="flex items-center gap-4 justify-end w-full">
                  <img
                    className="w-16 h-16 rounded-full"
                    src={auth}
                    alt="auth"
                  />
                  <div className="flex flex-col justify-center">
                    <span className="text-[18px] font-medium">Quang</span>
                    <span className="text-[12px] font-base">User</span>
                  </div>
                </div>
                <div>
                  <div className="flex flex-col items-start gap-2">
                    <span>
                      You are at a bus station. You want to go to a city nearby.
                      You need help finding the right bus. Talk to the station
                      assistant to ask about the bus number, the tickets and the
                      schedule.
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-[0.8] flex items-center justify-end px-20 gap-4 pt-4">
                <GrLanguage size={20} />
                <FiSettings size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-1/6">
        <div className="py-4 px-4 rounded-full bg-blue-700 cursor-pointer">
          <MdMicNone size={50} className="text-white " />
        </div>
      </div>
    </div>
  );
};

export default Speech;
