import { useState } from "react";
import NavigationBar from "../../components/navigation/navigation-bar";
import { UserTable } from "../../components/tables/user-table";
import {
  ChartBarIcon,
  ChartPieIcon,
  DocumentCheckIcon,
  Square2StackIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
const items = [
  {
    id: 1,
    name: "Dashboard",
    icon: (
      <ChartBarIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8 " />
    ),
  },
  {
    id: 2,
    name: "Projects",
    icon: (
      <Square2StackIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 3,
    name: "Tasks",
    icon: (
      <DocumentCheckIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 4,
    name: "Reporting",
    icon: (
      <ChartPieIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 5,
    name: "Users",
    icon: <UsersIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />,
  },
];
const Home = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Dashboard");
  return (
    <main className="w-full h-screen flex flex-row relative bg-white">
      <div className="w-[10%]">
        <NavigationBar items={items} onSelect={setSelectedPage} />
      </div>

      <section className="flex flex-col p-10 ml-20 items-center justify-center gap-5 w-[90%] ">
        {selectedPage === "Dashboard" && <UserTable />}
        {selectedPage === "Projects" && "abc"}
      </section>
    </main>
  );
};

export default Home;
