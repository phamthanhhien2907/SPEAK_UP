import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const NotFoundPage = lazy(() => import("./index"));
const notFoundRoutes: (RouteObject & { role?: string[] })[] = [
  {
    path: "*",
    element: <NotFoundPage />,
    role: ["admin"],
  },
];
export default notFoundRoutes;
