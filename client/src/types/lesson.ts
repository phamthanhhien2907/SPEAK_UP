import { Course } from "./course";

export type Lesson = {
    _id?: string;
    courseId?: Course;
    title?: string;
    content?: string;
    type?: "listening" | "speaking" | "vocabulary" | 'pronunciation';
    level?: string
};
export enum LessonType {
    LISTENING = "listening",
    SPEAKING = "speaking",
    VOCABULARY = "vocabulary",
    PRONUNCIATION = "pronunciation"
}
