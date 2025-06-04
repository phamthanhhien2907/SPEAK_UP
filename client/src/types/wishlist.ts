import { Lesson } from "./lesson";
import { User } from "./user";

export type Wishlist = {
    _id?: string;
    userId: User;
    lessonId?: Lesson;
};

