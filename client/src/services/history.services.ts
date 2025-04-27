import { History } from "@/types/history";
import axiosConfig from "../axios";
export const apiGetAllHistory = async () => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/history/",
        });
        return response;
    } catch (error) {
        console.error("Error fetching all history:", error);
        throw error;
    }
}
export const apiGetHistoryById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/history/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error fetching history by ID:", error);
        throw error;
    }
}
export const apiDeleteHistoryById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "DELETE",
            url: "/history/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error deleting history by ID:", error);
        throw error;
    }
}
export const apiCreateHistory = async (data: History) => {
    try {
        const response = await axiosConfig({
            method: "POST",
            url: "/history/",
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current history:", error);
        throw error;
    }
}
export const apiUpdateHistory = async (id: string, data: History) => {
    try {
        const response = await axiosConfig({
            method: "PUT",
            url: "/history/" + id,
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current history:", error);
        throw error;
    }
}
