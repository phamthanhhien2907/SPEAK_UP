import { useState } from "react";
import NavigationBar from "../../components/navigation/navigation-bar";
import { UserTable } from "../../components/tables/users/user-table";
import {
  ChartBarIcon,
  ChartPieIcon,
  DocumentCheckIcon,
  Square2StackIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { SelectedPageContext } from "../../hooks/use-context";
import { LessonTable } from "../../components/tables/lessons/lesson-table";
import ModalProvider from "../../components/provider/modal-provider";

const items = [
  {
    id: 1,
    name: "Users",
    icon: (
      <ChartBarIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8 " />
    ),
  },
  {
    id: 2,
    name: "Lessons",
    icon: (
      <Square2StackIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 3,
    name: "Vocabularies",
    icon: (
      <DocumentCheckIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 4,
    name: "Courses",
    icon: (
      <ChartPieIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 5,
    name: "Enrollments",
    icon: <UsersIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />,
  },
];

const Home = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Users");
  return (
    <SelectedPageContext.Provider value={{ selectedPage, setSelectedPage }}>
      <main className="w-full h-screen flex flex-row relative bg-white">
        <div className="w-[10%]">
          <NavigationBar items={items} onSelect={setSelectedPage} />
        </div>

        <section className="flex flex-col p-10 ml-20 items-center justify-center gap-5 w-[90%] ">
          <ModalProvider />
          {selectedPage === "Users" && <UserTable />}
          {selectedPage === "Lessons" && <LessonTable />}
        </section>
      </main>
    </SelectedPageContext.Provider>
  );
};

export default Home;
