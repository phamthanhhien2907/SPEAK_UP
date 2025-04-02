import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const SignUpPage = lazy(() => import("./index"));
const signupRoutes: RouteObject[] = [
  {
    path: "/sign-up/*",
    element: <SignUpPage />,
    index: true,
  },
];
export default signupRoutes;
