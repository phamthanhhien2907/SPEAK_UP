import { Suspense, lazy } from "react";

const HomePage = lazy(() => import("./index"));

export default function HomePageWrapper() {
  return (
    <Suspense fallback={<div>Loading public page...</div>}>
      <HomePage />
    </Suspense>
  );
}
