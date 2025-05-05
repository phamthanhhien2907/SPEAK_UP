import axiosConfig from "../axios";
import { Lesson } from "../types/lesson";
export const apiGetAllLesson = async () => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/lesson/",
        });
        return response;
    } catch (error) {
        console.error("Error fetching all lessons:", error);
        throw error;
    }
}
export const apiGetLessonById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/lesson/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error fetching lesson by ID:", error);
        throw error;
    }
}
export const apiDeleteLessonById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "DELETE",
            url: "/lesson/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error deleting user by ID:", error);
        throw error;
    }
}
export const apiCreateLesson = async (data: Lesson) => {
    try {
        const response = await axiosConfig({
            method: "POST",
            url: "/lesson/",
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current lesson:", error);
        throw error;
    }
}
export const apiUpdateLesson = async (id: string, data: Lesson) => {
    try {
        const response = await axiosConfig({
            method: "PUT",
            url: "/lesson/" + id,
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current lesson:", error);
        throw error;
    }
}
