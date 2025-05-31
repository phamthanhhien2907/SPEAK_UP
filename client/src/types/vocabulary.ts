import { Lesson } from "./lesson";

export type Vocabulary = {
    _id?: string;
    word?: string;
    phonetic?: string;
    meaning?: string;
    exampleSentence?: string;
    audioUrl?: string;
    lessonId?: Lesson;
};

