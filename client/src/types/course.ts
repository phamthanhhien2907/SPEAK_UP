
export type Course = {
    _id?: string;
    title?: string;
    description?: string;
    level?: "beginner" | "intermediate" | "advanced";
    thumbnail?: string;
};
export enum CourseLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced",
}