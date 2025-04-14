import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const AuthPage = lazy(() => import("./index"));
const authRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <AuthPage />,
    index: true,
  },
];
export default authRoutes;
