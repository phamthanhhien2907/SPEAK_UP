import axiosConfig from "@/axios";
import { ExerciseVocabulary } from "@/types/excercise-vocabulary";
export const apiGetAllExerciseVocabulary = async () => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/exerciseVocabulary/",
        });
        return response;
    } catch (error) {
        console.error("Error fetching all excercise vocabulary:", error);
        throw error;
    }
}
export const apiGetExerciseVocabularyById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/exerciseVocabulary/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error fetching excercise vocabulary by ID:", error);
        throw error;
    }
}
export const apiDeleteExerciseVocabularyById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "DELETE",
            url: "/exerciseVocabulary/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error deleting excercise vocabulary by ID:", error);
        throw error;
    }
}
export const apiCreateExerciseVocabulary = async (data: ExerciseVocabulary) => {
    try {
        const response = await axiosConfig({
            method: "POST",
            url: "/exerciseVocabulary/",
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching  excercise vocabcurrentulary:", error);
        throw error;
    }
}
export const apiUpdateExerciseVocabulary = async (id: string, data: ExerciseVocabulary) => {
    try {
        const response = await axiosConfig({
            method: "PUT",
            url: "/exerciseVocabulary/" + id,
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current excercise vocabulary:", error);
        throw error;
    }
}
