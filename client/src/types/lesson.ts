export type Lesson = {
    _id?: string;
    courseId?: string;
    title?: string;
    content?: string;
    type?: "listening" | "speaking" | "vocabulary";
};
export enum LessonType {
    LISTENING = "listening",
    SPEAKING = "speaking",
    VOCABULARY = "vocabulary",
}
