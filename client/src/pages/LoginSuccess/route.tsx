import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
const LoginSuccessPage = lazy(() => import("./index"));
const loginSuccessRoutes: (RouteObject & { role?: string[] })[] = [
  {
    path: "/login-success/:userId/:tokenLogin",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LoginSuccessPage />
      </Suspense>
    ),
  },
];
export default loginSuccessRoutes;
