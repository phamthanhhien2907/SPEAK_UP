import { Course } from "./course";

export type Topic = {
    _id?: string;
    title?: string;
    level?: number;
    thumbnail?: string;
    courseId?: Course;
    content?: string;
    type?: "speaking" | "pronunciation" | "vocabulary" | "listening"
    section?: "lesson" | "topic" | "ai-conversation"
    totalLessons?: number;
};
export enum SectionType {
    LESSON = "lesson",
    TOPIC = "topic",
    AI_CONVERSATION = "ai-conversation"
}
export enum TopicType {
    SPEAKING = "speaking",
    PRONUNCIATION = "pronunciation",
    VOCABULARY = "vocabulary",
    LISTENING = "listening"
}