export type User = {
    _id?: string;
    username?: string;
    email?: string;
    role?: "student" | "teacher" | "admin";
    level?: number;
    firstname?: string;
    lastname?: string;
    password?: string;
    avatar?: string;
    createdAt?: Date;
    updatedAt?: Date;
    total_score?: number;
};
export enum UserType {
    STUDENT = "student",
    TEACHER = "teacher",
    ADMIN = "admin",
}

