import { useSelectedPageContext } from "@/hooks/use-context";
import { UserTable } from "@/components/tables/users/user-table";
import { LessonTable } from "@/components/tables/lessons/lesson-table";
import { CourseTable } from "@/components/tables/course/course-table";
import { VocabularyTable } from "@/components/tables/vocabularies/vocabulary-table";
import { EnrollmentTable } from "@/components/tables/enrollments/enrollment-table";
import { ProgressTrackingTable } from "@/components/tables/progress-tracking/progress-tracking-table";
import { ExcerciseTable } from "@/components/tables/exercises/exercise-table";
import { HistoryTable } from "@/components/tables/histories/history-table";
import { FeedBackTable } from "@/components/tables/feedbacks/feedback-table";
import { LessonProgressTable } from "@/components/tables/lesson-progress/lesson-progress-table";
import { PronunciationScoreTable } from "@/components/tables/pronunciation-score/pronunciation-score-table";
import { ExcerciseVocabularyTable } from "@/components/tables/exercise-vocabulary/exercise-vocabulary-table";
import { TopicTable } from "@/components/tables/topic/topic-table";
const TableProvider = () => {
  const { selectedPage } = useSelectedPageContext();

  return (
    <>
      {selectedPage === "Users" && <UserTable />}
      {selectedPage === "Lessons" && <LessonTable />}
      {selectedPage === "Courses" && <CourseTable />}
      {selectedPage === "Vocabularies" && <VocabularyTable />}
      {selectedPage === "Enrollments" && <EnrollmentTable />}
      {selectedPage === "Progress Tracking" && <ProgressTrackingTable />}
      {selectedPage === "Exercise Vocabulary" && <ExcerciseVocabularyTable />}
      {selectedPage === "Exercise" && <ExcerciseTable />}
      {selectedPage === "History" && <HistoryTable />}
      {selectedPage === "FeedBack" && <FeedBackTable />}
      {selectedPage === "Lesson Progress" && <LessonProgressTable />}
      {selectedPage === "Pronunciation Score" && <PronunciationScoreTable />}
      {selectedPage === "Topic" && <TopicTable />}

      {/* {selectedPage === "Settings" && <VocabularyTable />} */}
    </>
  );
};

export default TableProvider;
