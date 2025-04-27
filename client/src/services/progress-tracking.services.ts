import { ProgressTracking } from "@/types/progress-tracking";
import axiosConfig from "../axios";
export const apiGetAllProgressTracking = async () => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/progressTracking/",
        });
        return response;
    } catch (error) {
        console.error("Error fetching all progress tracking:", error);
        throw error;
    }
}
export const apiGetProgressTrackingById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/progressTracking/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error fetching progress tracking by ID:", error);
        throw error;
    }
}
export const apiDeleteProgressTrackingById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "DELETE",
            url: "/progressTracking/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error deleting progress tracking by ID:", error);
        throw error;
    }
}
export const apiCreateProgressTracking = async (data: ProgressTracking) => {
    try {
        const response = await axiosConfig({
            method: "POST",
            url: "/progressTracking/",
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current progress tracking:", error);
        throw error;
    }
}
export const apiUpdateProgressTracking = async (id: string, data: ProgressTracking) => {
    try {
        const response = await axiosConfig({
            method: "PUT",
            url: "/progressTracking/" + id,
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current progress tracking:", error);
        throw error;
    }
}
