import { Lesson } from "./lesson";
import { User } from "./user";

export type Feedback = {
    _id?: string;
    userId?: User;
    lessonId?: Lesson;
    comment?: string;
    rating?: number;
};

export enum FeedbackRating {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
}