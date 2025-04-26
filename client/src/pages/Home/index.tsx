import { useState } from "react";
import NavigationBar from "../../components/navigation/navigation-bar";
import { UserTable } from "../../components/tables/users/user-table";
import {
  Square2StackIcon,
  DocumentCheckIcon,
  ChartPieIcon,
  UsersIcon,
  ClockIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  AdjustmentsHorizontalIcon,
  SpeakerWaveIcon,
  ClipboardDocumentListIcon,
  PencilIcon,
  ArrowLeftEndOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { SelectedPageContext } from "../../hooks/use-context";
import { LessonTable } from "../../components/tables/lessons/lesson-table";
import ModalProvider from "../../components/provider/modal-provider";
import { CourseTable } from "@/components/tables/course/course-table";
import { VocabularyTable } from "@/components/tables/vocabularies/vocabulary-table";
import { EnrollmentTable } from "@/components/tables/enrollments/enrollment-table";
import { ProgressTrackingTable } from "@/components/tables/progress-tracking/progress-tracking-table";
import { ExcerciseTable } from "@/components/tables/exercises/exercise-table";
import { HistoryTable } from "@/components/tables/histories/history-table";
import { FeedBackTable } from "@/components/tables/feedbacks/feedback-table";
import { LessonProgressTable } from "@/components/tables/lesson-progress/lesson-progress-table";
import { PronunciationScoreTable } from "@/components/tables/pronunciation-score/pronunciation-score-table";

const items = [
  {
    id: 1,
    name: "Users",
    icon: <UserIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />,
  },
  {
    id: 2,
    name: "Lessons",
    icon: (
      <Square2StackIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 3,
    name: "Vocabularies",
    icon: (
      <DocumentCheckIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 4,
    name: "Courses",
    icon: (
      <ChartPieIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 5,
    name: "Enrollments",
    icon: <UsersIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />,
  },
  {
    id: 6,
    name: "Progress Tracking",
    icon: (
      <ClipboardDocumentListIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 7,
    name: "Exercise Vocabulary",
    icon: (
      <BookOpenIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 8,
    name: "Exercise",
    icon: <PencilIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />,
  },
  {
    id: 9,
    name: "History",
    icon: <ClockIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />,
  },
  {
    id: 10,
    name: "FeedBack",
    icon: (
      <ChatBubbleLeftRightIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 11,
    name: "Lesson Progress",
    icon: (
      <CheckCircleIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 12,
    name: "Pronunciation Score",
    icon: (
      <SpeakerWaveIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
  {
    id: 13,
    name: "Settings",
    icon: (
      <AdjustmentsHorizontalIcon className="stroke-gray-800/70 stroke-[1] min-w-8 w-8" />
    ),
  },
];

const Home = () => {
  const [selectedPage, setSelectedPage] = useState<string>("Users");
  return (
    <SelectedPageContext.Provider value={{ selectedPage, setSelectedPage }}>
      <main className="w-full h-screen flex flex-row relative bg-white overflow-hidden">
        <div className="flex flex-col bg-gray-100 h-screen overflow-y-auto min-w-[200px]">
          <NavigationBar items={items} onSelect={setSelectedPage} />
        </div>

        <section className="flex flex-col flex-1 p-8 overflow-y-auto items-center justify-center gap-5 ">
          <ModalProvider />
          {selectedPage === "Users" && <UserTable />}
          {selectedPage === "Lessons" && <LessonTable />}
          {selectedPage === "Courses" && <CourseTable />}
          {selectedPage === "Vocabularies" && <VocabularyTable />}
          {selectedPage === "Enrollments" && <EnrollmentTable />}
          {selectedPage === "Progress Tracking" && <ProgressTrackingTable />}
          {selectedPage === "Exercise Vocabulary" && <VocabularyTable />}
          {selectedPage === "Exercise" && <ExcerciseTable />}
          {selectedPage === "History" && <HistoryTable />}
          {selectedPage === "FeedBack" && <FeedBackTable />}
          {selectedPage === "Lesson Progress" && <LessonProgressTable />}
          {selectedPage === "Pronunciation Score" && (
            <PronunciationScoreTable />
          )}
          {selectedPage === "Settings" && <VocabularyTable />}
        </section>
      </main>
    </SelectedPageContext.Provider>
  );
};

export default Home;
