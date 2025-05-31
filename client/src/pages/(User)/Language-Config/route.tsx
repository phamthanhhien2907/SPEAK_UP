import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const LanguageConfigPage = lazy(() => import("./index"));
const authRoutes: (RouteObject & { role?: string[] })[] = [
  {
    path: "/language-config",
    element: <LanguageConfigPage />,
    index: true,
  },
];
export default authRoutes;
