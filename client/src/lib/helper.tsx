import {
  ChartBarIcon,
  ChartPieIcon,
  DocumentCheckIcon,
  Square2StackIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
export const items = [
  {
    id: 1,
    name: "Dashboard",
    icon: <ChartBarIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />,
  },
  {
    id: 2,
    name: "Projects",
    icon: (
      <Square2StackIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
    ),
  },
  {
    id: 3,
    name: "Tasks",
    icon: (
      <DocumentCheckIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />
    ),
  },
  {
    id: 4,
    name: "Reporting",
    icon: <ChartPieIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />,
  },
  {
    id: 5,
    name: "Users",
    icon: <UsersIcon className="stroke-inherit stroke-[0.75] min-w-8 w-8" />,
  },
];
