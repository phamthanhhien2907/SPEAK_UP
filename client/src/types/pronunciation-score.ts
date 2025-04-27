
export type PronunciationScore = {
    _id?: string;
    userId?: string;
    exerciseId?: string;
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