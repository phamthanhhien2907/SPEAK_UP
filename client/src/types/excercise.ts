import { Lesson } from "./lesson";

export type Excercise = {
    _id?: string;
    lessonId?: Lesson;
    type?: "repeat_sentence" | "fill_in_blank" | "pronunciation" | "listening"
    prompt?: string;
    correctPronunciation?: string;
    difficultyLevel?: string
};
export enum ExcerciseType {
    REPEAT_SENTENCE = "repeat_sentence",
    FILL_IN_BLANK = "fill_in_blank",
    PRONUNCIATION = "pronunciation",
    LISTENING = "listening",
}
export enum DifficultyLevelType {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
}

