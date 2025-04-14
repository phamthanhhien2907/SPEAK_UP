import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const NotFoundPage = lazy(() => import("./index"));
const notFoundRoutes: RouteObject[] = [
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
export default notFoundRoutes;
