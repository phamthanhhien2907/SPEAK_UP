import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const LanguageLevelPage = lazy(() => import("./index"));
const authRoutes: (RouteObject & { role?: string[] })[] = [
  {
    path: "/language-level",
    element: <LanguageLevelPage />,
    index: true,
  },
];
export default authRoutes;
