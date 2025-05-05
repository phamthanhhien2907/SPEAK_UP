import { PronunciationScore } from "@/types/pronunciation-score";
import axiosConfig from "../axios";
export const apiGetAllPronunciationScore = async () => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/pronunciationScore/",
        });
        return response;
    } catch (error) {
        console.error("Error fetching all pronunciation score:", error);
        throw error;
    }
}
export const apiGetPronunciationScoreById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/pronunciationScore/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error fetching pronunciation score by ID:", error);
        throw error;
    }
}
export const apiDeletePronunciationScoreById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "DELETE",
            url: "/pronunciationScore/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error deleting pronunciation score by ID:", error);
        throw error;
    }
}
export const apiCreatePronunciationScore = async (data: PronunciationScore) => {
    try {
        const response = await axiosConfig({
            method: "POST",
            url: "/pronunciationScore/",
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current pronunciation score:", error);
        throw error;
    }
}
export const apiUpdatePronunciationScoren = async (id: string, data: PronunciationScore) => {
    try {
        const response = await axiosConfig({
            method: "PUT",
            url: "/pronunciationScore/" + id,
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current pronunciation score:", error);
        throw error;
    }
}
