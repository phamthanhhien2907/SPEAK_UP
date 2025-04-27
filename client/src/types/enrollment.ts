
export type Enrollment = {
    _id?: string;
    courseId?: string;
    userId?: string;
    progress?: number;
    status?: "in_progress" | "completed" | "dropped";
};
export enum EnrollmentStatus {
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    DROPPED = "dropped",
}
export enum EnrollmentProgress {
    ZERO = 0,
    TEN = 10,
    TWENTY = 20,
    THIRTY = 30,
    FORTY = 40,
    FIFTY = 50,
    SIXTY = 60,
    SEVENTY = 70,
    EIGHTY = 80,
    NINETY = 90,
    HUNDRED = 100,
}