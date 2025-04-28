import { Excercise } from "./excercise";
import { Vocabulary } from "./vocabulary";

export type ExerciseVocabulary = {
    _id?: string;
    exerciseId?: Excercise;
    vocabularyId?: Vocabulary;
};
