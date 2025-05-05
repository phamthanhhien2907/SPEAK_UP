import { LessonProgress } from "@/types/lesson-progress";
import axiosConfig from "../axios";
export const apiGetAllLessonProgress = async () => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/lessonProgress/",
        });
        return response;
    } catch (error) {
        console.error("Error fetching all lesson progress:", error);
        throw error;
    }
}
export const apiGetLessonProgressById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/lessonProgress/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error fetching lesson progress by ID:", error);
        throw error;
    }
}
export const apiDeleteLessonProgressById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "DELETE",
            url: "/lessonProgress/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error deleting lesson progress by ID:", error);
        throw error;
    }
}
export const apiCreateLessonProgress = async (data: LessonProgress) => {
    try {
        const response = await axiosConfig({
            method: "POST",
            url: "/lessonProgress/",
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current lesson progress:", error);
        throw error;
    }
}
export const apiUpdateLessonProgress = async (id: string, data: LessonProgress) => {
    try {
        const response = await axiosConfig({
            method: "PUT",
            url: "/lessonProgress/" + id,
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current lesson progress:", error);
        throw error;
    }
}
