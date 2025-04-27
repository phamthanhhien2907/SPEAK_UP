import { Excercise } from "@/types/excercise";
import axiosConfig from "../axios";
export const apiGetAllExercise = async () => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/exercise/",
        });
        return response;
    } catch (error) {
        console.error("Error fetching all exercise:", error);
        throw error;
    }
}
export const apiGetExerciseById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "GET",
            url: "/exercise/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error fetching exercise by ID:", error);
        throw error;
    }
}
export const apiDeleteExerciseById = async (id: string) => {
    try {
        const response = await axiosConfig({
            method: "DELETE",
            url: "/exercise/" + id,
        });
        return response;
    } catch (error) {
        console.error("Error deleting exercise by ID:", error);
        throw error;
    }
}
export const apiCreateExercise = async (data: Excercise) => {
    try {
        const response = await axiosConfig({
            method: "POST",
            url: "/exercise/",
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current exercise:", error);
        throw error;
    }
}
export const apiUpdateExercise = async (id: string, data: Excercise) => {
    try {
        const response = await axiosConfig({
            method: "PUT",
            url: "/exercise/" + id,
            data
        });
        return response;
    } catch (error) {
        console.log("Error fetching current exercise:", error);
        throw error;
    }
}
