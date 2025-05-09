import { Vocabulary } from "@/types/vocabulary";
import axiosConfig from "../axios";
export const apiGetAllVocabulary = async () => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/vocabulary/",
        });
        return response;
    } catch (error) {
        console.error("Error fetching all vocabulary:", error);
        throw error;
    }
}
export const apiGetVocabularyById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/vocabulary/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error fetching vocabulary by ID:", error);
        throw error;
    }
}
export const apiGetVocabularyByLessonId = async (lessonId: string) => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/vocabulary/getByLessonId/" + lessonId,
        });
        return response;
    } catch (error) {
        console.error("Error fetching vocabulary by ID:", error);
        throw error;
    }
}

export const apiDeleteVocabularyById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "DELETE",
            url: "/vocabulary/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error deleting vocabulary by ID:", error);
        throw error;
    }
}
export const apiCreateVocabulary = async (data: Vocabulary) => {
    try {
        const response = await axiosConfig({
            method: "POST",
            url: "/vocabulary/",
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current vocabulary:", error);
        throw error;
    }
}
export const apiUpdateVocabulary = async (id: string, data: Vocabulary) => {
    try {
        const response = await axiosConfig({
            method: "PUT",
            url: "/vocabulary/" + id,
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current vocabulary:", error);
        throw error;
    }
}
