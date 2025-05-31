import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import PublicPageWrapper from "./wrapper";
const HomePage = lazy(() => import("../Home/index"));
const LessonPage = lazy(() => import("../Lesson/index"));
const SpeechPage = lazy(() => import("../Speech/index"));
const PronunciationPage = lazy(() => import("../Pronunciation/index"));
const VocabularyPage = lazy(() => import("../Vocabulary/index"));
const TopicPage = lazy(() => import("../Topic/index"));
const ListTopicPage = lazy(() => import("../Topic/index.card"));
const TopicDetailsPage = lazy(() => import("../Topic/_id"));
const TopicExcercisePage = lazy(() => import("../TopicExcercise/index"));
import "./index.css";

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
            <SpeechPage />
          </Suspense>
        ),
      },
      {
        path: "/vocabulary/:lessonId",
        element: (
          <Suspense
            fallback={
              <>
                <div id="load">
                  <div>G</div>
                  <div>N</div>
                  <div>I</div>
                  <div>D</div>
                  <div>A</div>
                  <div>O</div>
                  <div>L</div>
                </div>
              </>
            }
          >
            <VocabularyPage />
          </Suspense>
        ),
      },
      {
        path: "/topic/",
        element: (
          <Suspense
            fallback={
              <>
                <div id="load">
                  <div>G</div>
                  <div>N</div>
                  <div>I</div>
                  <div>D</div>
                  <div>A</div>
                  <div>O</div>
                  <div>L</div>
                </div>
              </>
            }
          >
            <TopicPage />
          </Suspense>
        ),
      },
      {
        path: "/topic/:topicId",
        element: (
          <Suspense
            fallback={
              <>
                <div id="load">
                  <div>G</div>
                  <div>N</div>
                  <div>I</div>
                  <div>D</div>
                  <div>A</div>
                  <div>O</div>
                  <div>L</div>
                </div>
              </>
            }
          >
            <ListTopicPage />
          </Suspense>
        ),
      },
      {
        path: "/topic/:topicId/:title",
        element: (
          <Suspense
            fallback={
              <>
                <div id="load">
                  <div>G</div>
                  <div>N</div>
                  <div>I</div>
                  <div>D</div>
                  <div>A</div>
                  <div>O</div>
                  <div>L</div>
                </div>
              </>
            }
          >
            <TopicDetailsPage />
          </Suspense>
        ),
      },
      {
        path: "/topic-excercise/:lessonId/",
        element: (
          <Suspense
            fallback={
              <>
                <div id="load">
                  <div>G</div>
                  <div>N</div>
                  <div>I</div>
                  <div>D</div>
                  <div>A</div>
                  <div>O</div>
                  <div>L</div>
                </div>
              </>
            }
          >
            <TopicExcercisePage />
          </Suspense>
        ),
      },
      {
        path: "/pronunciation",
        element: (
          <Suspense
            fallback={
              <>
                <div id="load">
                  <div>G</div>
                  <div>N</div>
                  <div>I</div>
                  <div>D</div>
                  <div>A</div>
                  <div>O</div>
                  <div>L</div>
                </div>
              </>
            }
          >
            <PronunciationPage />
          </Suspense>
        ),
      },
    ],
    role: ["student", "teacher"],
  },
];

export default publicRoutes;
