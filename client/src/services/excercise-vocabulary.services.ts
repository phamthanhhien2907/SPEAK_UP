import axiosConfig from "@/axios";
import { ExerciseVocabulary } from "@/types/excercise-vocabulary";
export const apiGetAllExcerciseVocabulary = async () => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/excerciseVocabulary/",
        });
        return response;
    } catch (error) {
        console.error("Error fetching all excercise vocabulary:", error);
        throw error;
    }
}
export const apiGetExcerciseVocabularyById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/excerciseVocabulary/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error fetching excercise vocabulary by ID:", error);
        throw error;
    }
}
export const apiDeleteExcerciseVocabularyById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "DELETE",
            url: "/excerciseVocabulary/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error deleting excercise vocabulary by ID:", error);
        throw error;
    }
}
export const apiCreateExcerciseVocabulary = async (data: ExerciseVocabulary) => {
    try {
        const response = await axiosConfig({
            method: "POST",
            url: "/excerciseVocabulary/",
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching  excercise vocabcurrentulary:", error);
        throw error;
    }
}
export const apiUpdateExcerciseVocabulary = async (id: string, data: ExerciseVocabulary) => {
    try {
        const response = await axiosConfig({
            method: "PUT",
            url: "/excerciseVocabulary/" + id,
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current excercise vocabulary:", error);
        throw error;
    }
}
