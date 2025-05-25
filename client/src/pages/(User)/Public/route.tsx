import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import PublicPageWrapper from "./wrapper";
const HomePage = lazy(() => import("../Home/index"));
const LessonPage = lazy(() => import("../Lesson/index"));
const SpeechPage = lazy(() => import("../Speech/index"));
const PronunciationPage = lazy(() => import("../Pronunciation/index"));
const VocabularyPage = lazy(() => import("../Vocabulary/index"));
const TopicPage = lazy(() => import("../Topic/index"));

const publicRoutes: (RouteObject & { role?: string[] })[] = [
  {
    path: "/",
    element: <PublicPageWrapper />,
    children: [
      {
        path: "",
        element: <HomePage />,
        index: true,
      },
      {
        path: "/lesson/:parentTopicId",
        element: <LessonPage />,
      },
      {
        path: "/speech/:lessonId",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SpeechPage />
          </Suspense>
        ),
      },
      {
        path: "/vocabulary/:lessonId",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <VocabularyPage />
          </Suspense>
        ),
      },
      {
        path: "/topic/",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <TopicPage />
          </Suspense>
        ),
      },
      {
        path: "/pronunciation",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PronunciationPage />
          </Suspense>
        ),
      },
    ],
    role: ["student", "teacher"],
  },
];

export default publicRoutes;
