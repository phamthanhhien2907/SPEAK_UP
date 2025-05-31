import { Suspense, lazy } from "react";
import { RouteObject } from "react-router-dom";
const GetStartedPage = lazy(() => import("./index"));
const authRoutes: (RouteObject & { role?: string[] })[] = [
  {
    path: "/get-started",
    element: (
      <Suspense
        fallback={
          <div id="load">
            <div>G</div>
            <div>N</div>
            <div>I</div>
            <div>D</div>
            <div>A</div>
            <div>O</div>
            <div>L</div>
          </div>
        }
      >
        <GetStartedPage />
      </Suspense>
    ),
    index: true,
  },
];
export default authRoutes;
