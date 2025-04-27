export type Feedback = {
    userId?: string;
    lessonId?: string;
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