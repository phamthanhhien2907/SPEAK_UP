import { Feedback } from "@/types/feedback";
import axiosConfig from "../axios";
export const apiGetAllFeedBack = async () => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/feedback/",
        });
        return response;
    } catch (error) {
        console.error("Error fetching all feedback:", error);
        throw error;
    }
}
export const apiGetFeedBackById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/feedback/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error fetching feedback by ID:", error);
        throw error;
    }
}
export const apiDeleteFeedBackById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "DELETE",
            url: "/feedback/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error deleting feedback by ID:", error);
        throw error;
    }
}
export const apiCreateFeedBack = async (data: Feedback) => {
    try {
        const response = await axiosConfig({
            method: "POST",
            url: "/feedback/",
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current feedback:", error);
        throw error;
    }
}
export const apiUpdateFeedBack = async (id: string, data: Feedback) => {
    try {
        const response = await axiosConfig({
            method: "PUT",
            url: "/feedback/" + id,
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current feedback:", error);
        throw error;
    }
}
