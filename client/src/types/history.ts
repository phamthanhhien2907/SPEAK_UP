import { Excercise } from "./excercise";
import { Lesson } from "./lesson";
import { User } from "./user";

export type History = {
    _id?: string;
    userId?: User;
    lessonId?: Lesson;
    exerciseId?: Excercise;
    attempts?: number;
    lastAttemptAt?: Date;
};
export enum AttemptsType {
    ZERO = 1,
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