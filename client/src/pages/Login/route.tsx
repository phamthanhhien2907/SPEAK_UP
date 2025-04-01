import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const LoginPage = lazy(() => import("./index"));
const loginRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
];
export default loginRoutes;
