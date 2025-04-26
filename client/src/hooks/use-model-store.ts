
import { create } from "zustand";
import { User } from "../types/user";
export type ModalType =
  | "createUser"
  | "editUser"
  | "deleteUser"
  | "createLesson"
  | "editLesson"
  | "deleteLesson"
  | "createCourse"
  | "editCourse"
  | "deleteCourse" | "createEnrollment"
  | "deleteEnrollment"
  | "editEnrollment" | "createExercise"
  | "editExercise" | "deleteExercise"
  | "createVocabulary" | "deleteVocabulary" |
  "editVocabulary" | "createHistory" |
  "deleteHistory" | "editHistory" | "createFeedBack" |
  "deleteFeedBack" | "editFeedBack" |
  "createtLessonProgress" | "deleteLessonProgress" |
  "editLessonProgress" | "createProgressTracking" | "deleteProgressTracking" |
  "editProgressTracking" | "createPronunciationScore" | "deletePronunciationScore" | "editPronunciationScore" | "createExerciseVocabulary" | "editExerciseVocabulary" | "deleteExerciseVocabulary"

export interface ModalData {
  user?: User;
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
