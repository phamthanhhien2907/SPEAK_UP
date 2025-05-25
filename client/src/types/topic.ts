
export type Topic = {
    _id?: string;
    title?: string;
    description?: string;
    level?: number;
    thumbnail?: string;
    courseId: string;
    content?: string;
    type?: "speaking" | "pronunciation" | "vocabulary" | "listening"
    section?: "lesson" | "topic";
    totalLessons?: number;
};
export enum Section {
    LESSON = "lesson",
    TOPIC = "topic"
}
export enum TopicType {
    SPEAKING = "speaking",
    PRONUNCIATION = "pronunciation",
    VOCABULARY = "vocabulary",
    LISTENING = "listening"
}