import { Course } from "./course";

export type Lesson = {
    _id?: string;
    courseId?: Course;
    title?: string;
    content?: string;
    type?: "listening" | "speaking" | "vocabulary" | 'pronunciation';
    parentLessonId?: Lesson;
    parentTopicId?: string;
    totalLessons?: number;
    level?: number;
    thumbnail?: string;
    aiImg?: string;
    name?: string;
    isAIConversationEnabled?: "true" | "false";
    category?: "basics" | "intermediate" | "professional"
};
export enum LessonType {
    LISTENING = "listening",
    SPEAKING = "speaking",
    VOCABULARY = "vocabulary",
    PRONUNCIATION = "pronunciation"
}
export enum CategoryType {
    BASICS = "basics",
    INTERMEDIATE = "intermediate",
    PROFESSIONAL = "professional"
}
export enum AIConversationEnabledType {
    TRUE = "true",
    FALSE = "false"
}
