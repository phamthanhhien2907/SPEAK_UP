import { Excercise } from "./excercise";
import { User } from "./user";

export type PronunciationScore = {
    _id?: string;
    userId?: User;
    exerciseId?: Excercise;
    phonetic?: string
    userAudioUrl?: string;
    score?: number;
};
export enum PronunciationScoreType {
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