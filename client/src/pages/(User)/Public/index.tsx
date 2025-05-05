import { Outlet } from "react-router-dom";
import NavigationBar from "@/components/navigation/navigation-bar";
import home from "@/assets/user/home.png";
import lesson from "@/assets/user/lesson.png";
import progress from "@/assets/user/progress.png";
import explore from "@/assets/user/explore.png";
import briefcase from "@/assets/user/briefcase.png";
import chat from "@/assets/user/chat.png";
import setting from "@/assets/user/setting.png";
import { SelectedPageProvider } from "@/components/navigation/navigation-provider";
const items = [
  {
    id: 1,
    name: "Trang chủ",
    icon: (
      <img src={home} className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 2,
    name: "Bài học",
    icon: (
      <img src={lesson} className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 3,
    name: "Khám phá",
    icon: (
      <img
        src={explore}
        className="stroke-gray-800/70 stroke-[1] min-w-8 w-8"
      />
    ),
  },
  {
    id: 4,
    name: "Tiến độ",
    icon: (
      <img
        src={progress}
        className="stroke-gray-800/70 stroke-[1] min-w-8 w-8"
      />
    ),
  },
  {
    id: 5,
    name: "Hồ sơ",
    icon: (
      <img
        src={briefcase}
        className="stroke-gray-800/70 stroke-[1] min-w-8 w-8"
      />
    ),
  },
  {
    id: 6,
    name: "Chat",
    icon: (
      <img src={chat} className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 7,
    name: "Setting",
    icon: (
      <img
        src={setting}
        className="stroke-gray-800/70 stroke-[1] min-w-8 w-8"
      />
    ),
  },
];
const Public = () => {
  return (
    <div>
      <SelectedPageProvider initialPage="Trang chủ">
        <main className="w-full h-screen flex flex-row relative bg-white overflow-hidden gap-4 basis-1/6">
          <div className="flex flex-col bg-gray-100 h-screen">
            <NavigationBar items={items} />
          </div>
          <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
            <Outlet />
          </div>
        </main>
      </SelectedPageProvider>
    </div>
  );
};

export default Public;
