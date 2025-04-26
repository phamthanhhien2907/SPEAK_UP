
export type Course = {
    _id?: string;
    title?: string;
    description?: string;
    level?: string;
    thumbnail?: string;
};
export enum CourseLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced",

}