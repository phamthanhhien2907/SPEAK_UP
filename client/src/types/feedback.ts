import { Lesson } from "./lesson";
import { User } from "./user";

export type Feedback = {
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