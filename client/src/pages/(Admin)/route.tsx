import { RouteObject } from "react-router-dom";
import HomePageWrapper from "./wrapper";
const homeRoutes: (RouteObject & { role?: string[] })[] = [
  {
    path: "/",
    element: <HomePageWrapper />,
    index: true,
    role: ["admin"],
  },
];
export default homeRoutes;
