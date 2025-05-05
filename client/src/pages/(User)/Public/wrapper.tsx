import { Suspense, lazy } from "react";
const PublicPage = lazy(() => import("./index"));
export default function PublicPageWrapper() {
  return (
    <Suspense fallback={<div>Loading public page...</div>}>
      <PublicPage />
    </Suspense>
  );
}
