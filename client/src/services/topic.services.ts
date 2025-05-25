import { Topic } from "@/types/topic";
import axiosConfig from "../axios";
export const apiGetAllTopic = async () => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/topic/",
        });
        return response;
    } catch (error) {
        console.error("Error fetching all topics:", error);
        throw error;
    }
}
export const apiGetTopicById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/topic/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error fetching topic by ID:", error);
        throw error;
    }
}
export const apiDeleteTopicById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "DELETE",
            url: "/topic/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error deleting topic by ID:", error);
        throw error;
    }
}
export const apiCreateTopic = async (data: Topic) => {
    try {
        const response = await axiosConfig({
            method: "POST",
            url: "/topic/",
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current topic:", error);
        throw error;
    }
}
export const apiUpdateTopic = async (id: string, data: Topic) => {
    try {
        const response = await axiosConfig({
            method: "PUT",
            url: "/topic/" + id,
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current topic:", error);
        throw error;
    }
}
