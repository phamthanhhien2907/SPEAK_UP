import { CreateCourseModal } from "../modals/course-modal/create-course-modal";
import { DeleteCourseModal } from "../modals/course-modal/delete-course-modal";
import { EditCourseModal } from "../modals/course-modal/edit-course-modal";
import { CreateLessonModal } from "../modals/lesson-modal/create-lesson-modal";
import { DeleteLessonModal } from "../modals/lesson-modal/delete-lesson-modal";
import { EditLessonModal } from "../modals/lesson-modal/edit-lesson-modal";
import { CreateUserModal } from "../modals/user-modal/create-user-modal";
import { DeleteUserModal } from "../modals/user-modal/delete-user-modal";
import { EditUserModal } from "../modals/user-modal/edit-user-modal";

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
    </>
  );
};

export default ModalProvider;
