
import { create } from "zustand";
import { User } from "../types/user";
import { Lesson } from "@/types/lesson";
import { Course } from "@/types/course";
import { LessonProgress } from "@/types/lesson-progress";
import { Vocabulary } from "@/types/vocabulary";
import { Excercise } from "@/types/excercise";
import { ExerciseVocabulary } from "@/types/excercise-vocabulary";
import { Feedback } from "@/types/feedback";
import { Enrollment } from "@/types/enrollment";
import { History } from "@/types/history";
import { ProgressTracking } from "@/types/progress-tracking";
import { PronunciationScore } from "@/types/pronunciation-score";
import { Topic } from "@/types/topic";
export type ModalType =
  | "createUser"
  | "editUser"
  | "deleteUser"
  | "createLesson"
  | "editLesson"
  | "deleteLesson"
  | "createCourse"
  | "editCourse"
  | "deleteCourse"
  | "createEnrollment"
  | "deleteEnrollment"
  | "editEnrollment"
  | "createExercise"
  | "editExercise"
  | "deleteExercise"
  | "createVocabulary" | "deleteVocabulary" |
  "editVocabulary" | "createHistory" |
  "deleteHistory" | "editHistory" | "createFeedBack" |
  "deleteFeedBack" | "editFeedBack" |
  "createtLessonProgress" | "deleteLessonProgress" |
  "editLessonProgress" | "createProgressTracking" | "deleteProgressTracking" |
  "editProgressTracking" | "createPronunciationScore" | "deletePronunciationScore" | "editPronunciationScore" | "createExerciseVocabulary" | "editExerciseVocabulary" | "deleteExerciseVocabulary" | "createTopic" | "editTopic" | "deleteTopic"

export interface ModalData {
  user?: User;
  lesson?: Lesson;
  course?: Course;
  vocabulary?: Vocabulary;
  lessonProgress?: LessonProgress;
  progressTracking?: ProgressTracking;
  exercise?: Excercise;
  exerciseVocabulary?: ExerciseVocabulary;
  history?: History;
  feedback?: Feedback;
  pronunciationScore?: PronunciationScore;
  enrollment?: Enrollment;
  topic?: Topic;
}
interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}
export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));
