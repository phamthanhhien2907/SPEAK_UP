import { User } from "./user";

export type ProgressTracking = {
    _id?: string;
    userId?: User;
    completedLessons?: number;
    totalScore?: number;
};

export enum CompletedLessonsType {
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
export enum TotalScoreType {
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