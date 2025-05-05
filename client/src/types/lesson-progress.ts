import { Lesson } from "./lesson";
import { User } from "./user";

export type LessonProgress = {
    _id?: string;
    lessonId?: Lesson;
    userId?: User;
    score?: number;
};

export enum LessonProgressScore {
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