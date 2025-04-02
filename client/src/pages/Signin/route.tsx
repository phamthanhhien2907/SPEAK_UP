import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const SignInPage = lazy(() => import("./index"));
const signinRoutes: RouteObject[] = [
  {
    path: "/sign-in/*",
    element: <SignInPage />,
    index: true,
  },
];
export default signinRoutes;
