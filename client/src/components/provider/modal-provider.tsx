import { CreateCourseModal } from "../modals/course-modal/create-course-modal";
import { DeleteCourseModal } from "../modals/course-modal/delete-course-modal";
import { EditCourseModal } from "../modals/course-modal/edit-course-modal";
import { CreateEnrollmentModal } from "../modals/enrollment-modal/create-enrollment-modal";
import { DeleteEnrollmentModal } from "../modals/enrollment-modal/delete-enrollment-modal";
import { EditEnrollmentModal } from "../modals/enrollment-modal/edit-enrollment-modal";
import { CreateExerciseVocabularyModal } from "../modals/excercise-vocabulary-modal/create-exercise-vocabulary-modal";
import { DeleteExerciseVocabularyModall } from "../modals/excercise-vocabulary-modal/delete-exercise-vocabulary-modal";
import { EditExerciseVocabularyModal } from "../modals/excercise-vocabulary-modal/edit-exercise-vocabulary-modal";
import { CreateExerciseModal } from "../modals/exercise-modal/create-exercise-modal";
import { DeleteExerciseModal } from "../modals/exercise-modal/delete-exercise-modal";
import { EditExerciseModal } from "../modals/exercise-modal/edit-exercise-modal";
import { CreateFeedBackModal } from "../modals/feedback-modal/create-feedback-modal";
import { DeleteFeedBackModal } from "../modals/feedback-modal/delete-feedback-modal";
import { EditFeedBackModal } from "../modals/feedback-modal/edit-feedback-modal";
import { CreateHistoryModal } from "../modals/history-modal/create-history-modal";
import { DeleteHistoryModal } from "../modals/history-modal/delete-history-modal";
import { EditHistoryModal } from "../modals/history-modal/edit-history-modal";
import { CreateLessonModal } from "../modals/lesson-modal/create-lesson-modal";
import { DeleteLessonModal } from "../modals/lesson-modal/delete-lesson-modal";
import { EditLessonModal } from "../modals/lesson-modal/edit-lesson-modal";
import { CreateLessonProgressModal } from "../modals/lesson-progress-modal/create-lesson-progress-modal";
import { DeleteLessonProgressModal } from "../modals/lesson-progress-modal/delete-lesson-progress-modal";
import { EditLessonProgressModal } from "../modals/lesson-progress-modal/edit-lesson-progress-modal";
import { CreateProgressTrackingModal } from "../modals/progress-tracking-modal/create-progress-tracking-modal";
import { DeleteProgressTrackingModal } from "../modals/progress-tracking-modal/delete-progress-tracking-modal";
import { EditProgressTrackingModal } from "../modals/progress-tracking-modal/edit-progress-tracking-modal";
import { CreatePronunciationScoreModal } from "../modals/pronunciation-score-modal/create-pronunciation-score-modal";
import { DeletePronunciationScoreModal } from "../modals/pronunciation-score-modal/delete-pronunciation-score-modal";
import { EditPronunciationScoreModal } from "../modals/pronunciation-score-modal/edit-pronunciation-score-modal";
import { CreateUserModal } from "../modals/user-modal/create-user-modal";
import { DeleteUserModal } from "../modals/user-modal/delete-user-modal";
import { EditUserModal } from "../modals/user-modal/edit-user-modal";
import { CreateVocabularyModal } from "../modals/vocabulary-modal/create-vocabulary-modal";
import { DeleteVocabularyModal } from "../modals/vocabulary-modal/delete-vocabulary-modal";
import { EditVocabularyModal } from "../modals/vocabulary-modal/edit-vocabulary-modal";

const ModalProvider = () => {
  return (
    <>
      <CreateUserModal />
      <EditUserModal />
      <DeleteUserModal />
      <CreateLessonModal />
      <EditLessonModal />
      <DeleteLessonModal />
      <CreateCourseModal />
      <EditCourseModal />
      <DeleteCourseModal />
      <CreateEnrollmentModal />
      <DeleteEnrollmentModal />
      <EditEnrollmentModal />
      <CreateExerciseModal />
      <EditExerciseModal />
      <DeleteExerciseModal />
      <CreateExerciseVocabularyModal />
      <EditExerciseVocabularyModal />
      <DeleteExerciseVocabularyModall />
      <CreateFeedBackModal />
      <EditFeedBackModal />
      <DeleteFeedBackModal />
      <CreateHistoryModal />
      <EditHistoryModal />
      <DeleteHistoryModal />
      <CreateLessonProgressModal />
      <EditLessonProgressModal />
      <DeleteLessonProgressModal />
      <CreateProgressTrackingModal />
      <EditProgressTrackingModal />
      <DeleteProgressTrackingModal />
      <CreatePronunciationScoreModal />
      <EditPronunciationScoreModal />
      <DeletePronunciationScoreModal />
      <CreateVocabularyModal />
      <EditVocabularyModal />
      <DeleteVocabularyModal />
    </>
  );
};

export default ModalProvider;
